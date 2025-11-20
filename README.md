BrightLearn — educational website demo

What's included
- Several pages: index, courses, course-* pages, about, faq, contact.
- Simple PHP form handler (submit_contact.php) with:
  - Google reCAPTCHA v2 verification (server-side)
  - Basic IP rate-limiting (file-based)
  - Storing messages to /data/messages.log

How to brand
- Replace assets/logo-placeholder.png with your logo.
- Edit config/brand.json (optional) or directly change colors in style.css.

reCAPTCHA setup
1. Create site & secret keys at https://www.google.com/recaptcha/admin (choose reCAPTCHA v2 - "I'm not a robot" Checkbox).
2. Replace REPLACE_WITH_SITE_KEY in contact.html with your site key.
3. Replace REPLACE_WITH_SECRET_KEY in submit_contact.php with your secret key.

Server requirements
- A PHP-capable webserver (PHP 7.4+ recommended) and HTTPS.
- cURL enabled for PHP (used to verify reCAPTCHA).
- If using Apache, you can drop the provided .htaccess into the web root.

Security notes & recommendations
- reCAPTCHA reduces automated spam but is not perfect.
- Keep the site behind HTTPS (Let's Encrypt provides free TLS).
- Use a WAF or Cloudflare in front of your site for additional protection.
- For production, use a proper database and hardened rate-limiting (Redis, fail2ban).
- Use server-side logging and monitoring.

Firewall examples (place in server shell, replace X.X.X.X with your admin IP)
- Basic ufw rules:
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable

- Example iptables snippet to block an abusive IP:
  sudo iptables -A INPUT -s X.X.X.X -j DROP

If you want, I can:
- Swap reCAPTCHA for hCaptcha or Turnstile (Cloudflare).
- Add email sending via SMTP securely.
- Wire a proper backend using Node/Express, PHP+MySQL or Supabase.
