# Security Policy

## Supported Versions
Only the latest version of TwinStack is currently supported for security updates.

| Version | Supported |
| :--- | :--- |
| v1.0.x | ✅ Yes |
| < v1.0.0 | ❌ No |

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

If you discover a potential security flaw, please report it privately to:
**security@parallax-studio.internal**

We value responsible disclosure. Please provide:
- A descriptive title of the vulnerability.
- Steps to reproduce the issue.
- Impact analysis.

### Our Commitment
- We will acknowledge receipt of your report within 48 hours.
- We will provide a estimated timeline for a fix.
- We will notify you once the fix has been deployed.

## Password Handling
TwinStack never stores plain-text passwords. All credentials are hashed using **bcryptjs** with a cost factor of 10.

## Authentication
We use **Firebase Auth** for identity management. Session tokens are managed by Firebase SDKs and stored securely in the browser.
