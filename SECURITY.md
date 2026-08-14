# 🛡️ Security Policy

> [!IMPORTANT]
> At Zertainity, we take the security and privacy of our student profiles, assessments, and system integrity very seriously. Thank you for helping us maintain a safe platform.

---

## 🏛️ Supported Versions

We actively provide security updates and maintenance patches for the following versions:

| Version | Supported |
| :--- | :---: |
| **Latest** (`main` branch) | ✅ |
| **Older releases / tags** | ❌ |

---

## 🚨 Reporting a Vulnerability

If you discover a security flaw or vulnerability within the Zertainity platform, please report it to us privately to prevent exploit exposure.

### Direct Contact Channels

*   📧 **Maintainer Backup**: `johanmanoj2009@gmail.com`

---

## 📌 Vulnerability Report Guidelines

Please include the following details in your report to help us evaluate and patch the issue quickly:

1.  **Issue Description**: Detailed summary of the vulnerability, explaining what was compromised.
2.  **Steps to Reproduce**: Clear, step-by-step description or sample script demonstrating the exploit.
3.  **Potential Impact**: Estimation of what user profiles, credentials, or system features could be accessed.
4.  **Proof of Concept (PoC)**: Screen recordings, code samples, or requests (if safe to include).

---

## ⏱️ Response SLA

*   **Initial Response**: Within **48 hours** confirming receipt of the report.
*   **Fix Implementation**: As soon as possible, depending on the severity of the flaw. We will keep you updated during the patch development.

---

## 🔒 Implemented Security Protocols

Zertainity builds on a secure-by-default architecture utilizing:

*   **Supabase Row Level Security (RLS)**: Enforces row-level isolation so students can never read or write other users' assessment scores, marks, or profile information.
*   **Secure API Endpoints**: Internal queries and modifications are parsed through Supabase Edge Functions with cryptographically signed tokens.
*   **Safe Client Authentication**: Passwords, OAuth configurations, and database tokens are handled directly through Supabase Auth, keeping frontend storage free of credentials.
*   **Protected Environments**: Secrets and integration keys are loaded at compile-time using environment variables, never checked into public branches.

---

## ⚠️ Responsible Disclosure

> [!WARNING]
> Please do **not** disclose the security issue on public GitHub Issues, social media, or other open forums prior to our official patch.
> 
> Avoid exploiting the vulnerability beyond a simple, non-destructive Proof of Concept.

Thank you for practicing responsible security disclosure! ❤️
