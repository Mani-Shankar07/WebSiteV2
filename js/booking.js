/**
 * DR. PUJA'S CLINIC — Booking System v3 (Calendly Edition)
 * 
 * SETUP REQUIRED:
 * 1. Create a Calendly account and create an Event Type for each location/video.
 * 2. Paste your Calendly links in the BOOKING_CONFIG.calendly.urls section below.
 * 3. The Calendly widget script is loaded dynamically when the user clicks "Confirm".
 */

// ─── CONFIGURATION ─────────────────────────────────────────────────────────
const BOOKING_CONFIG = {
    // ─── Calendly Links ──────────────────────────────────────────────
    // Create these event types in your Calendly dashboard and paste the URLs here.
    calendly: {
        urls: {
            'madhu-vihar':   'https://calendly.com/YOUR_USERNAME/madhu-vihar',   
            'pushpanjali':   'https://calendly.com/YOUR_USERNAME/pushpanjali',   
            'max':           'https://calendly.com/YOUR_USERNAME/max-hospital',  
            'femmenest':     'https://calendly.com/YOUR_USERNAME/femmenest',     
            'video':         'https://calendly.com/YOUR_USERNAME/video-consult'  
        }
    },
    // ─── WhatsApp ────────────────────────────────────────────────────
    whatsapp: {
        phone: '919899416040',
        enabled: true,
    },
    // ─── Clinic Info ─────────────────────────────────────────────────
    clinic: {
        name:  "Dr. Puja's Clinic",
        email: 'drpujasclinic@gmail.com',
        phone: '+91-9899416040',
    },
};

// ─── SECURITY: XSS Prevention ──────────────────────────────────────────────
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ─── LOCATION DATA ─────────────────────────────────────────────────────────
const LOCATIONS = [
    {
        id: 'madhu-vihar',
        name: "Dr. Puja's Clinic, Madhu Vihar",
        address: 'A 128, Gali No 8, Sai Chowk, Madhu Vihar, IP Extension, Patparganj, New Delhi — 110092',
        fee: '₹800',
        days: 'Mon – Sat & Sunday (12 PM – 2 PM only)',
    },
    {
        id: 'pushpanjali',
        name: 'Pushpanjali Hospital',
        address: 'Karkardooma, Delhi',
        fee: '₹1,000',
        days: 'Wed & Sat, 10 AM – 12 PM',
    },
    {
        id: 'max',
        name: 'Max Super Speciality Hospital',
        address: '108A, Indraprastha Extension, Patparganj',
        fee: '₹1,000',
        days: 'Tue 2–4 PM, Sun 9–11 AM',
    },
    {
        id: 'femmenest',
        name: 'Femmenest',
        address: 'Karkardooma, Delhi',
        fee: '₹1,000',
        days: 'Mon & Thu, 9–11 AM',
    },
];

// ─── STATE ─────────────────────────────────────────────────────────────────
let bookingState = {
    type: null,     // 'clinic' | 'video'
    location: null, // LOCATIONS entry
    name: '',
    phone: '',
    email: '',
    reason: '',
    step: 1,
};

// ─── INIT & CALENDLY LOADER ────────────────────────────────────────────────
function initBooking() {
    // Pre-load Calendly CSS for better UX when the popup opens
    if (!document.querySelector('link[href*="calendly"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(link);
    }
}

function loadCalendlyScript() {
    return new Promise((resolve, reject) => {
        if (typeof Calendly !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ─── MODAL CONTROLS ────────────────────────────────────────────────────────
function openBooking(locationId) {
    const overlay = document.getElementById('bookingOverlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    resetBookingState();

    if (locationId) {
        const loc = LOCATIONS.find(l => l.id === locationId);
        if (loc) {
            bookingState.type = 'clinic';
            bookingState.location = loc;
            renderStep(3); // Skip type + location, go to details
            return;
        }
    }
    renderStep(1);
}

function closeBooking() {
    document.getElementById('bookingOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function resetBookingState() {
    bookingState = { type: null, location: null, name: '', phone: '', email: '', reason: '', step: 1 };
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
    const label = document.getElementById('step1NextLabel');
    if (label) label.textContent = 'Next: Choose Location →';
}

// ─── STEP ROUTER ───────────────────────────────────────────────────────────
// Note: We map JS steps to existing HTML IDs to avoid restructuring your HTML.
// JS Step 1 -> bookStep1 (Type)
// JS Step 2 -> bookStep2 (Location)
// JS Step 3 -> bookStep4 (Details Form)
// JS Step 4 -> bookStepConfirm (Review & Confirm)
function renderStep(step) {
    bookingState.step = step;
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    
    let targetId = '';
    if (step === 1) targetId = 'bookStep1';
    else if (step === 2) targetId = 'bookStep2';
    else if (step === 3) targetId = 'bookStep4'; // Details form
    else if (step === 4) targetId = 'bookStepConfirm'; // Summary

    const el = document.getElementById(targetId);
    if (el) el.classList.add('active');
    
    updateStepIndicator(step);

    if (step === 2 && bookingState.type === 'clinic') renderLocationStep();
    if (step === 3) renderDetailsStep();
    if (step === 4) renderConfirmSummary();
}

function updateStepIndicator(activeStep) {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`stepDot${i}`);
        if (!dot) continue;
        dot.className = 'step-dot';
        if (i < activeStep) { dot.classList.add('done'); dot.textContent = ''; }
        else if (i === activeStep) { dot.classList.add('active'); dot.textContent = i; }
        else { dot.textContent = i; }

        const line = document.getElementById(`stepLine${i}`);
        if (line) line.className = 'step-line' + (i < activeStep ? ' done' : '');
    }
}

// ─── STEP 1: TYPE ──────────────────────────────────────────────────────────
function selectConsultationType(type) {
    bookingState.type = type;
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`typeCard_${type}`).classList.add('selected');
    
    const nextBtn = document.getElementById('step1Next');
    nextBtn.classList.remove('btn-disabled');
    nextBtn.removeAttribute('disabled');
    
    const label = document.getElementById('step1NextLabel');
    label.textContent = type === 'video' ? 'Next: Your Details →' : 'Next: Choose Location →';
}

function goStep1Next() {
    if (!bookingState.type) return;
    if (bookingState.type === 'video') {
        renderStep(3); // Skip location, go to details
    } else {
        renderStep(2);
    }
}

// ─── STEP 2: LOCATION ──────────────────────────────────────────────────────
function renderLocationStep() {
    const container = document.getElementById('locationOptionsList');
    if(!container) return;
    
    container.innerHTML = LOCATIONS.map(loc => `
        <div class="location-option ${bookingState.location?.id === loc.id ? 'selected' : ''}" onclick="selectLocation('${loc.id}')">
            <div>
                <div class="location-option-name">${loc.name}</div>
                <div class="location-option-detail">${loc.days} · ${loc.address.split(',')[0]}</div>
            </div>
            <div class="location-option-fee">${loc.fee}</div>
        </div>
    `).join('');
    checkStep2();
}

function selectLocation(locId) {
    bookingState.location = LOCATIONS.find(l => l.id === locId);
    renderLocationStep();
}

function checkStep2() {
    const btn = document.getElementById('step2Next');
    if (!btn) return;
    if (bookingState.location) {
        btn.classList.remove('btn-disabled');
        btn.removeAttribute('disabled');
    } else {
        btn.classList.add('btn-disabled');
        btn.setAttribute('disabled', '');
    }
}

// ─── STEP 3: DETAILS (Mapped to bookStep4 in HTML) ─────────────────────────
function renderDetailsStep() {
    const nameEl = document.getElementById('bName');
    const phoneEl = document.getElementById('bPhone');
    if (nameEl) nameEl.value = bookingState.name;
    if (phoneEl) phoneEl.value = bookingState.phone;
}

function validateDetails() {
    const name = document.getElementById('bName').value.trim();
    const phone = document.getElementById('bPhone').value.trim();
    const email = document.getElementById('bEmail').value.trim();
    let valid = true;

    [{ id: 'bName', val: name, msg: 'Name is required' },
     { id: 'bPhone', val: phone, msg: 'Phone number is required' }].forEach(f => {
        const el = document.getElementById(f.id);
        const err = document.getElementById(f.id + 'Error');
        if (!f.val) { 
            el.classList.add('error'); 
            if (err) err.textContent = f.msg; 
            valid = false; 
        } else { 
            el.classList.remove('error'); 
            if (err) err.textContent = ''; 
        }
    });

    if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
        document.getElementById('bPhone').classList.add('error');
        document.getElementById('bPhoneError').textContent = 'Enter a valid 10-digit Indian mobile number';
        valid = false;
    }

    if (valid) {
        bookingState.name = name;
        bookingState.phone = phone;
        bookingState.email = email;
        bookingState.reason = document.getElementById('bReason')?.value || '';
        renderStep(4); // Go to Confirm step
    }
}

// ─── STEP 4: CONFIRM SUMMARY ───────────────────────────────────────────────
function renderConfirmSummary() {
    const s = bookingState;
    const rows = [
        { label: 'Patient', value: s.name },
        { label: 'Phone', value: s.phone },
        s.email ? { label: 'Email', value: s.email } : null,
        { label: 'Type', value: s.type === 'video' ? 'Video Consultation' : 'In-Clinic Visit' },
        s.location ? { label: 'Location', value: s.location.name } : { label: 'Location', value: 'Online (Video)' },
        { label: 'Fee', value: s.type === 'video' ? '₹800' : (s.location?.fee || '₹800') },
    ].filter(Boolean);

    // XSS SECURE: Using escapeHTML on all user inputs
    document.getElementById('confirmSummaryRows').innerHTML = rows.map(r => `
        <div class="summary-row">
            <span class="summary-label">${r.label}</span>
            <span class="summary-value">${escapeHTML(r.value)}</span>
        </div>
    `).join('');
}

// ─── CONFIRM & OPEN CALENDLY ───────────────────────────────────────────────
async function confirmBooking() {
    const consent = document.getElementById('bookingConsent');
    if (!consent.checked) { 
        showNotification('⚠️ Consent Required', 'Please accept the consent to continue.'); 
        return; 
    }

    const btn = document.getElementById('confirmBtn');
    btn.disabled = true;
    btn.textContent = 'Opening Scheduler...';

    // Determine which Calendly URL to use
    const locId = bookingState.type === 'video' ? 'video' : bookingState.location?.id;
    const calendlyUrl = BOOKING_CONFIG.calendly.urls[locId];

    if (!calendlyUrl || calendlyUrl.includes('YOUR_USERNAME')) {
        alert('Booking system is not configured yet. Please call the clinic directly.');
        btn.disabled = false;
        btn.textContent = '✓ Confirm Appointment';
        return;
    }

    try {
        // Load Calendly script dynamically if not already loaded
        await loadCalendlyScript();

        // Open Calendly Popup Widget with pre-filled patient details
        Calendly.initPopupWidget({
            url: calendlyUrl,
            prefill: {
                name: bookingState.name,
                email: bookingState.email,
                phoneNumber: bookingState.phone
            },
            utm: {
                utmCampaign: 'Website Booking',
                utmMedium: 'Website',
                utmSource: 'Dr Puja Website'
            }
        });

        // Show local success screen
        showSuccessScreen();

    } catch (error) {
        console.error('Calendly load failed:', error);
        alert('Unable to open the booking calendar. Please call us at +91-9899416040.');
        btn.disabled = false;
        btn.textContent = '✓ Confirm Appointment';
    }
}

function showSuccessScreen() {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.getElementById('bookStepSuccess').classList.add('active');
    document.querySelectorAll('.step-dot').forEach(d => { d.className = 'step-dot done'; d.textContent = '✓'; });
    document.querySelectorAll('.step-line').forEach(l => l.classList.add('done'));
    
    // Update final summary securely
    const s = bookingState;
    document.getElementById('confirmSummaryFinal').innerHTML = `
        <strong>${escapeHTML(s.name)}</strong><br>
        ${escapeHTML(s.type === 'video' ? 'Video Consultation' : s.location?.name || '')}<br>
        Fee: ${escapeHTML(s.type === 'video' ? '₹800' : (s.location?.fee || '₹800'))}
    `;

    showNotification('Opening Calendar ✓', 'Please select your time in the popup window.');
}

// ─── CONTACT FORM (WhatsApp Fallback) ──────────────────────────────────────
function submitContactForm(e) {
    e.preventDefault();
    const consent = document.getElementById('contactConsent');
    if (!consent.checked) { alert('Please accept the consent to proceed.'); return; }

    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const phone = document.getElementById('cPhone').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    // Construct WhatsApp Message
    const waMsg = `Hi Dr. Puja's Clinic! 🙏\nI'm contacting via the website.\n\n👤 Name: ${name}\n📱 Phone: ${phone}\n${email ? '📧 Email: ' + email + '\n' : ''}💬 Message: ${message}`;
    
    // Open WhatsApp in a new tab
    window.open(`https://wa.me/${BOOKING_CONFIG.whatsapp.phone}?text=${encodeURIComponent(waMsg)}`, '_blank');

    // Show local success UI
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('contactSuccess').style.display = 'block';
    showNotification('Message Sent ✓', "Redirecting to WhatsApp...");
}

// ─── NOTIFICATION ──────────────────────────────────────────────────────────
function showNotification(title, msg) {
    const n = document.getElementById('notification');
    if(!n) return;
    document.getElementById('notifTitle').textContent = title;
    document.getElementById('notifMsg').textContent = msg;
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 5000);
}

// ─── AUTO-INIT ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initBooking();
});