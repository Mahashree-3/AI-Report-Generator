import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ ok: false, error: "No token provided. Please login." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ ok: false, error: "Invalid or expired token. Please login again." });
    }
    req.user = user;
    next();
  });
}

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ ok: false, error: "Username, email, and password are all required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ ok: false, error: "Password must be at least 6 characters." });
  }

  try {
    const existing = db.prepare("SELECT id FROM users WHERE email = ? OR username = ?").get(email, username);
    if (existing) {
      return res.status(409).json({ ok: false, error: "Username or email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    stmt.run(username, email, hashedPassword);

    res.json({ ok: true, message: "Registration successful! You can now login." });
  } catch (error) {
    console.error("💥 Register error:", error);
    res.status(500).json({ ok: false, error: "Something went wrong during registration." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "Email and password are required." });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ ok: false, error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ ok: true, token, username: user.username });
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({ ok: false, error: "Something went wrong during login." });
  }
});

app.get("/me", authenticateToken, (req, res) => {
  res.json({ ok: true, username: req.user.username, email: req.user.email });
});

app.get("/my-reports", authenticateToken, (req, res) => {
  try {
    const reports = db
      .prepare(
        "SELECT id, title, description, created_at FROM reports WHERE user_id = ? ORDER BY created_at DESC"
      )
      .all(req.user.id);
    res.json({ ok: true, reports });
  } catch (error) {
    console.error("💥 Error fetching reports:", error);
    res.status(500).json({ ok: false, error: "Could not fetch your reports." });
  }
});

app.get("/report/:id", authenticateToken, (req, res) => {
  try {
    const report = db
      .prepare("SELECT * FROM reports WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.user.id);

    if (!report) {
      return res.status(404).json({ ok: false, error: "Report not found." });
    }
    res.json({ ok: true, report });
  } catch (error) {
    console.error("💥 Error fetching report:", error);
    res.status(500).json({ ok: false, error: "Could not fetch the report." });
  }
});

app.post("/generate-report", authenticateToken, async (req, res) => {
  const { title, description, workflow, languages } = req.body;

  if (!title || !description || !workflow || !languages) {
    return res.status(400).json({
      ok: false,
      error: "All fields (title, description, workflow, and languages) are required.",
    });
  }

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `
You are an expert academic report writer.

Generate a **structured, formal academic project report** using ONLY plain text (no Markdown or HTML).
The formatting will be handled on the frontend, so output should be clean and consistent.

🧾 FORMAT RULES:
- Each CHAPTER must start on a new page (use "\\f" before each chapter except ABSTRACT).
- All CHAPTER TITLES must be centered and appear in uppercase (e.g., CHAPTER 1 INTRODUCTION).
- All SUBHEADINGS (e.g., 1.1 Background) must be bold in meaning (plain text, frontend will format).
- Maintain ONE font style for the entire document.
- Avoid repetition and filler text — make each paragraph unique and meaningful.
- The content must relate directly to the given project details.
- Maintain justified alignment and proper academic tone.

📘 PROJECT DETAILS:
Title: ${title}
Description: ${description}
Workflow: ${workflow}
Languages/Tools Used: ${languages}
Date: ${todayDate}

📄 REQUIRED STRUCTURE:

ABSTRACT
(Write 200–250 words summarizing project aim, methodology, and results.)

\\f
CHAPTER 1
INTRODUCTION
1.1 Background
1.2 Problem Statement
1.3 Objectives of the Project
1.4 Scope of the Project
\\f
CHAPTER 2
LITERATURE REVIEW
2.1 Existing Systems
2.2 Related Research Works
2.3 Comparative Study

\\f
CHAPTER 3
METHODOLOGY
3.1 System Design
3.2 Architecture Overview
3.3 Module Description
3.4 Workflow Explanation (based on user's provided workflow)

\\f
CHAPTER 4
IMPLEMENTATION
4.1 Tools and Technologies Used(based on user's provided Languages/Tools)
4.2 System Modules
4.3 Integration and Testing

\\f
CHAPTER 5
RESULTS AND DISCUSSION
5.1 Output Overview
5.2 Analysis and Discussion

\\f
CHAPTER 6
CONCLUSION AND FUTURE ENHANCEMENT
6.1 Conclusion
6.2 Future Scope

\\f
CHAPTER 7
REFERENCES
Include 5–10 valid and recent academic references in APA or IEEE format.

⚠️ RULES:
- Write in formal academic English.
- Avoid repeating sentences.
- Use clear transitions between sections.
- Avoid any Markdown, bullet points, or special symbols.
- Keep the content relevant to the project details above.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    const cleanText = rawText
      .replace(/[#*_`~]/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/(\\f\s*)+/g, "\f\n")
      .trim();

    const stmt = db.prepare(
      "INSERT INTO reports (user_id, title, description, workflow, languages, report_text) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(req.user.id, title, description, workflow, languages, cleanText);

    res.json({ ok: true, reportText: cleanText });
  } catch (error) {
    console.error("💥 Error generating report:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to generate report due to Gemini API or network issue. Please try again.",
      details: error.message,
    });
  }
});

app.listen(3000, () =>
  console.log("✅ Academic Report Generator running on port 3000")
);