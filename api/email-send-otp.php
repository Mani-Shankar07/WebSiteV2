<?php
// 1. Force error reporting ON
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "Milestone 1: Public stub reached\n";

// 2. Attempt to load the private backend file
$backendPath = dirname($_SERVER['DOCUMENT_ROOT']) . '/backend/api/email-send-otp.php';

if (!file_exists($backendPath)) {
    die("Error: Backend file not found at " . $backendPath);
}

echo "Milestone 2: Backend file exists, loading it now...\n";

require $backendPath;

echo "Milestone 3: Backend file finished executing successfully!\n";