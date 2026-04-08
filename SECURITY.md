# Security Policy

## 🛡 Supported Versions

We actively maintain and provide security updates for the latest version of Zertainity. 

| Version | Supported |
| :------ | :-------- |
| Latest | ✅ |
| Older versions | ❌ |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly. We take user data regarding education pathways and performance very seriously.

- **Email**: `security@zertainity.in` 
- **Alternative Contacts**: `johanmanoj2009@gmail.com` or `vineyragesh333@gmail.com`

---

## 📌 What to Include

Please include:

- A detailed description of the vulnerability.
- Steps to reproduce the issue.
- Possible impact regarding our user data or system integrity.
- Screenshots or proof of concept (if available).

---

## ⏱ Response Time

- Initial response: **within 48 hours**.
- Resolution (if valid): **as soon as possible**.

---

## 🔒 Security Measures

Zertainity follows modern security practices specifically tailored to our tech stack:

- **Supabase Row Level Security (RLS)**: Enforces that users can only see their own career profiles, marks, and settings.
- **Secure API Handling**: Verified endpoints executed via Supabase Backend functions.
- **No Sensitive Data**: User passwords and tokens are never stored directly in the frontend application or logged in the console.
- **Environment Variables**: Strict usage of environment variables for loading configurations cleanly.

---

## ⚠️ Responsible Disclosure

Please **do not**:

- Publicly disclose the issue on GitHub issues or social media before it is resolved securely.
- Exploit the vulnerability beyond minimal proof of concept to demonstrate the flaw.

We appreciate responsible security research! ❤️
