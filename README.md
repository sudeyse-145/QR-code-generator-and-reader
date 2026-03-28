📱 QR Code Social Link Generator & Reader
A professional full-stack solution that simplifies social networking. Instead of sharing five different links, users can generate one single QR code that houses their entire digital identity.

🚀 The Problem & Solution
Sharing contact info across multiple platforms (Telegram, X, Instagram, TikTok) is tedious. This app allows users to connect all their handles in one place, generating a unique QR code that others can scan to instantly access all linked profiles.

🛠️ Tech Stack
Frontend & Mobile
Mobile App: Built for seamless user interaction and QR scanning.

QR Logic: Integrated libraries for high-speed generation and reading.

Backend & Database
Node.js/Express: Powering the API and handling user data.

PostgreSQL: Reliable relational database for storing encrypted user profiles and social links.

pgAdmin: Used for local database management and testing.

📂 Project Structure
Plaintext
├── backend/        # Express API and Database configurations
├── mobile-app/     # Mobile application source code
└── README.md       # Project documentation
⚙️ Features
Multi-Link Integration: Support for Telegram, X, Instagram, TikTok, Email, and Phone.

Instant QR Generation: Real-time generation as user data is updated.

Integrated Scanner: High-accuracy reader to decode profiles on the go.

Full-Stack Sync: Mobile app pulls data directly from the dedicated backend.