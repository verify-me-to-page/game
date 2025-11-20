<?php
// submit_contact.php
// Simple server-side form handler with reCAPTCHA v2 verification and rate limiting.
//
// IMPORTANT: replace 'REPLACE_WITH_SECRET_KEY' with your real secret key (see README).

session_start();

function client_ip() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    return $_SERVER['REMOTE_ADDR'];
}

$ip = client_ip();
$rate_limit_file = sys_get_temp_dir() . '/ratelimit_' . preg_replace('/[^a-z0-9_.-]/i', '_', $ip);
$now = time();
$limit_window = 60; // seconds
$max_requests = 6;  // max within window

$attempts = [];
if (file_exists($rate_limit_file)) {
    $data = @file_get_contents($rate_limit_file);
    $attempts = $data ? json_decode($data, true) : [];
    $attempts = array_filter($attempts, function($t) use ($now, $limit_window){ return ($now - $t) < $limit_window; });
}

if (count($attempts) >= $max_requests) {
    http_response_code(429);
    echo 'Too many requests. Please wait a minute.';
    exit;
}

// append attempt
$attempts[] = $now;
@file_put_contents($rate_limit_file, json_encode($attempts));

$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';
if (!$recaptcha_response) {
    http_response_code(400);
    echo 'reCAPTCHA token missing.';
    exit;
}

// verify with Google
$secret = 'REPLACE_WITH_SECRET_KEY';
$verify = curl_init('https://www.google.com/recaptcha/api/siteverify');
curl_setopt($verify, CURLOPT_POST, true);
curl_setopt($verify, CURLOPT_POSTFIELDS, http_build_query(['secret' => $secret, 'response' => $recaptcha_response, 'remoteip' => $ip]));
curl_setopt($verify, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($verify);
curl_close($verify);
$resData = json_decode($res, true);

if (empty($resData['success']) || $resData['score'] === 0) {
    http_response_code(403);
    echo 'reCAPTCHA verification failed.';
    exit;
}

// sanitize inputs
$name = substr(trim($_POST['name'] ?? ''), 0, 200);
$email = substr(trim($_POST['email'] ?? ''), 0, 200);
$message = substr(trim($_POST['message'] ?? ''), 0, 2000);

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo 'Missing required fields.';
    exit;
}

// Here you would normally send an email or store in database. For demo we'll store in file.
$storage = __DIR__ . '/data/messages.log';
@mkdir(__DIR__ . '/data', 0755, true);
$entry = [
    'time' => date('c'),
    'ip' => $ip,
    'name' => $name,
    'email' => $email,
    'message' => $message
];
file_put_contents($storage, json_encode($entry) . PHP_EOL, FILE_APPEND | LOCK_EX);

echo 'Message received. Thank you!';
