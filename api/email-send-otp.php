<?php
/**
 * Public router stub — lives in public_html/api/ so
 * https://drpujaprasad.in/api/email-send-otp.php works, without the real
 * backend code living inside the web root.
 *
 * Do NOT add echo/print/var_dump/ini_set('display_errors',1) here — any
 * stray output before or after the require breaks response.json() on
 * the frontend, since it must return pure JSON. Debug via error_log()
 * inside the backend file instead, and check the PHP error log.
 */
require dirname($_SERVER['DOCUMENT_ROOT']) . '/backend/api/email-send-otp.php';