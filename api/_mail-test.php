<?php
// TEMPORARY TEST SCRIPT — delete once verified.
require_once dirname($_SERVER['DOCUMENT_ROOT']) . '/backend/api/_bootstrap.php';
header('Content-Type: text/plain');

$fakePatient = ['name' => 'Test Patient', 'email' => 'dr.mani.shankar@gmail.com', 'phone' => '9899416040'];
$fakeAppointment = [
    'booking_ref' => 'DPCTEST5678',
    'appointment_date' => date('Y-m-d', strtotime('+2 days')),
    'appointment_time' => '13:30:00',
    'consult_type' => 'in_person',
    'fee_paise' => 80000,
    'reason' => 'Routine Check-up',
];
$fakeLocation = [
    'name' => "Dr. Puja's Clinic, Madhu Vihar",
    'address' => 'A 128, Gali No 8, Sai Chowk, Madhu Vihar, IP Extension, Patparganj, New Delhi 110092',
];

$ok = Mailer::bookingConfirmation($fakePatient, $fakeAppointment, $fakeLocation);
echo $ok ? "Sent OK — check inbox.\n" : "FAILED — check PHP error log for details.\n";