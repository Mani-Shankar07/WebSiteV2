<?php
// TEMPORARY TEST SCRIPT — delete once you've verified the .ics output.
require_once dirname($_SERVER['DOCUMENT_ROOT']) . '/backend/helpers/IcsBuilder.php';

$fakeAppointment = [
    'booking_ref' => 'DPCTEST1234',
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
$fakePatient = ['name' => 'Test Patient', 'email' => 'test@example.com'];

$ics = IcsBuilder::build($fakeAppointment, $fakeLocation, $fakePatient);

header('Content-Type: text/calendar; charset=utf-8');
header('Content-Disposition: attachment; filename="test-appointment.ics"');
header('Content-Length: ' . strlen($ics));
echo $ics;