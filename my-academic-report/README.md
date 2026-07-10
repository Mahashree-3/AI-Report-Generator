# 🤖 AI Academic Report Generator

An AI-powered web application that generates structured, formal academic project reports using Google's Gemini AI. Users can register, log in, generate reports based on their project details, download them as PDF, and view their report history from a personal dashboard.

## ✨ Features

- 🔐 **User Authentication** — Secure register/login system with JWT-based sessions and hashed passwords (bcrypt)
- 📝 **AI Report Generation** — Generates a full structured academic report (Abstract, Introduction, Literature Review, Methodology, Implementation, Results, Conclusion, References) using the Gemini API
- 📄 **PDF Export** — Download the generated report as a formatted PDF, including an optional result image
- 📊 **User Dashboard** — View and re-download all your previously generated reports
- 💾 **Persistent Storage** — User accounts and report history are stored in a local SQLite database
- 🎨 **Modern UI** — Dark glassmorphism-themed interface

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript, jsPDF
- **Backend:** Node.js, Express
- **Database:** SQLite (via `better-sqlite3`)
- **Authentication:** JWT (`jsonwebtoken`), `bcryptjs`
- **AI:** Google Gemini API (`@google/generative-ai`)

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Gemini API key](https://aistudio.google.com/app/apikey)

## 🚀 Getting Started

1. **Clone the repository**
```bash
   git clone https://github.com/Mahashree-3/AI-Report-Generator.git
   cd AI-Report-Generator/my-academic-report
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**

   Create a `.env` file in the `my-academic-report`
   folder:
4. **Start the server**
```bash
   node server.js
```
   The server runs on `http://localhost:3000` and automatically creates a `database.sqlite` file on first run.

5. **Open the app**

   Open `index.html` in your browser. You'll be redirected to the login page — register a new account to get started.

## 📁 Project Structure
my-academic-report/
├── server.js          # Express backend (auth + report generation API)
├── db.js              # SQLite database setup
├── pdf-generator.js   # Shared PDF generation logic
├── login.html          # Login page
├── register.html       # Registration page
├── dashboard.html       # User's report history
├── dashboard.js
├── index.html          # Report generator form
├── app.js
├── auth.js             # Shared auth helper functions
├── auth-style.css      # Auth pages styling
└── .env                # API keys (not committed to git)

## ⚠️ Security Note

Never commit your `.env` file or hardcode API keys in source files. This project uses environment variables to keep credentials out of version control.

## 📄 License

This project is for academic/educational purposes.
