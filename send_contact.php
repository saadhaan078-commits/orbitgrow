<?php
// ============================================================
// send_contact.php — OrbitGrow Contact Form Handler
// ✅ Works on Localhost (XAMPP) — Saves to file
// ✅ Works on Live Server — Sends email to saadhaan078@gmail.com
// ============================================================

// ─── CONFIGURATION ────────────────────────────────────────────
$to_email = "saadhaan078@gmail.com";  // 📧 All emails go here
$backup_file = "submissions.txt";      // 📁 Local backup file
// ──────────────────────────────────────────────────────────────

// ─── SPAM CHECK (Honeypot) ──────────────────────────────────
if (!empty($_POST['honeypot'])) {
    header("Location: contact.html?error=spam");
    exit;
}

// ─── GET FORM DATA ──────────────────────────────────────────
$name     = trim($_POST['fullName'] ?? '');
$email    = trim($_POST['email'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$country  = trim($_POST['countryCode'] ?? '');
$service  = trim($_POST['service'] ?? '');
$message  = trim($_POST['message'] ?? '');

// Country code to name
$country_names = [
    'PK' => 'Pakistan', 'IN' => 'India', 'US' => 'United States',
    'GB' => 'United Kingdom', 'AE' => 'UAE', 'SA' => 'Saudi Arabia',
    'AF' => 'Afghanistan', 'BD' => 'Bangladesh', 'CA' => 'Canada',
    'DE' => 'Germany', 'FR' => 'France', 'IT' => 'Italy',
];
$country_name = $country_names[$country] ?? $country;

// ─── VALIDATION ──────────────────────────────────────────────
$errors = [];

if (empty($name)) {
    $errors[] = "Name is required";
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Valid email is required";
}
if (empty($phone)) {
    $errors[] = "Phone number is required";
}
if (empty($service)) {
    $errors[] = "Service selection is required";
}
if (empty($message)) {
    $errors[] = "Message is required";
}

// Agar errors hain, toh wapas bhejein
if (!empty($errors)) {
    $error_string = implode(", ", $errors);
    header("Location: contact.html?error=" . urlencode($error_string));
    exit;
}

// ─── BUILD EMAIL ─────────────────────────────────────────────
$subject = "📬 New Contact Form Submission from $name";

// Plain text version
$plain_body = "
╔═══════════════════════════════════════════════════════════╗
║           NEW CONTACT FORM SUBMISSION                    ║
╚═══════════════════════════════════════════════════════════╝

👤 Name:        $name
📧 Email:       $email
📞 Phone:       $phone
🌍 Country:     $country_name
🛠️ Service:     $service

💬 Message:
─────────────────────────────────────────────────────────────
$message
─────────────────────────────────────────────────────────────

📅 Submitted: " . date('l, F j, Y \a\t g:i A') . "
🌐 IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Localhost') . "

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OrbitGrow — Performance Marketing & Web Development
";

// HTML version (for email clients)
$html_body = "
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { border-bottom: 3px solid #CBFF4F; padding-bottom: 16px; margin-bottom: 20px; }
    .header h1 { font-size: 22px; color: #0F1226; margin: 0; }
    .field { margin-bottom: 14px; }
    .field-label { font-weight: 700; color: #4B3DF0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .field-value { font-size: 16px; color: #1B1F3D; padding: 6px 0; }
    .message-box { background: #F3F4EF; border-radius: 8px; padding: 16px 20px; margin-top: 6px; border-left: 4px solid #CBFF4F; }
    .footer { margin-top: 30px; padding-top: 16px; border-top: 1px solid #e0e0e0; color: #888; font-size: 13px; text-align: center; }
    .badge { display: inline-block; background: #CBFF4F; color: #0F1226; padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 12px; }
</style>
</head>
<body>
<div class=\"container\">
    <div class=\"header\">
        <h1>📬 New Contact Form Submission</h1>
        <span class=\"badge\">OrbitGrow</span>
    </div>

    <div class=\"field\">
        <div class=\"field-label\">👤 Name</div>
        <div class=\"field-value\">$name</div>
    </div>

    <div class=\"field\">
        <div class=\"field-label\">📧 Email</div>
        <div class=\"field-value\"><a href=\"mailto:$email\">$email</a></div>
    </div>

    <div class=\"field\">
        <div class=\"field-label\">📞 Phone</div>
        <div class=\"field-value\">$phone</div>
    </div>

    <div class=\"field\">
        <div class=\"field-label\">🌍 Country</div>
        <div class=\"field-value\">$country_name</div>
    </div>

    <div class=\"field\">
        <div class=\"field-label\">🛠️ Service</div>
        <div class=\"field-value\"><strong>$service</strong></div>
    </div>

    <div class=\"field\">
        <div class=\"field-label\">💬 Message</div>
        <div class=\"message-box\">" . nl2br(htmlspecialchars($message)) . "</div>
    </div>

    <div class=\"field\" style=\"margin-top:16px; font-size:13px; color:#999;\">
        📅 Submitted: " . date('l, F j, Y \a\t g:i A') . "<br>
        🌐 IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Localhost') . "
    </div>

    <div class=\"footer\">
        — OrbitGrow | Performance Marketing &amp; Web Development —
    </div>
</div>
</body>
</html>
";

// ─── SEND EMAIL (Try both methods) ─────────────────────────

$mail_sent = false;

// Method 1: Try PHP's mail() function
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: OrbitGrow <noreply@orbitgrow.pk>\r\n";
$headers .= "Reply-To: $email\r\n";

if (function_exists('mail')) {
    $mail_sent = mail($to_email, $subject, $html_body, $headers);
    
    // If HTML fails, try plain text
    if (!$mail_sent) {
        $headers_plain = "From: OrbitGrow <noreply@orbitgrow.pk>\r\n";
        $headers_plain .= "Reply-To: $email\r\n";
        $mail_sent = mail($to_email, $subject, $plain_body, $headers_plain);
    }
}

// ─── SAVE TO FILE (Always save backup) ─────────────────────

$backup_entry = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$backup_entry .= "📅 Date: " . date('Y-m-d H:i:s') . "\n";
$backup_entry .= "👤 Name: $name\n";
$backup_entry .= "📧 Email: $email\n";
$backup_entry .= "📞 Phone: $phone\n";
$backup_entry .= "🌍 Country: $country_name\n";
$backup_entry .= "🛠️ Service: $service\n";
$backup_entry .= "💬 Message: $message\n";
$backup_entry .= "🌐 IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Localhost') . "\n";
$backup_entry .= "📧 Email Sent: " . ($mail_sent ? '✅ Yes' : '❌ No (Localhost)') . "\n\n";

file_put_contents($backup_file, $backup_entry, FILE_APPEND | LOCK_EX);

// ─── RESPOND TO USER ────────────────────────────────────────

// ✅ Always show success (even if email fails on localhost)
// Data is always saved in submissions.txt
header("Location: contact.html?success=1");
exit;
?>