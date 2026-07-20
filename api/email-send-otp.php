<?php
// 1. Turn on error reporting FIRST
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 2. Then attempt to load the backend file
require dirname($_SERVER['DOCUMENT_ROOT']) . '/backend/api/email-send-otp.php';
