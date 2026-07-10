import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-report", async (req, res) => {
  const { title, description, workflow, languages } = req.body;

  // 🔍 Validate input
  if (!title || !description || !workflow || !languages) {
    return res.status(400).json({
      ok: false,
      error:
        "All fields (title, description, workflow, and languages) are required.",
    });
  }

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 🧠 Formatted prompt with all the user requirements
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

\f
CHAPTER 1
INTRODUCTION
1.1 Background
1.2 Problem Statement
1.3 Objectives of the Project
1.4 Scope of the Project
\f
CHAPTER 2
LITERATURE REVIEW
2.1 Existing Systems
2.2 Related Research Works
2.3 Comparative Study

\f
CHAPTER 3
METHODOLOGY
3.1 System Design
3.2 Architecture Overview
3.3 Module Description
3.4 Workflow Explanation (based on user's provided workflow)

\f
CHAPTER 4
IMPLEMENTATION
4.1 Tools and Technologies Used(based on user's provided Languages/Tools)
4.2 System Modules
4.3 Integration and Testing

\f
CHAPTER 5
RESULTS AND DISCUSSION
5.1 Output Overview
5.2 Analysis and Discussion

\f
CHAPTER 6
CONCLUSION AND FUTURE ENHANCEMENT
6.1 Conclusion
6.2 Future Scope

\f
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
    // ⚙️ Configure Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 8192,
      },
    });

    // 🧠 Generate report
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    // 🧹 Clean and format output text
    const cleanText = rawText
      .replace(/[#*_`~]/g, "") // Remove markdown
      .replace(/\n{3,}/g, "\n\n") // Normalize spacing
      .replace(/(\\f\s*)+/g, "\f\n") // Ensure consistent page breaks
      .trim();

    res.json({ ok: true, reportText: cleanText });
  } catch (error) {
    console.error("💥 Error generating report:", error);
    res.status(500).json({
      ok: false,
      error:
        "Failed to generate report due to Gemini API or network issue. Please try again.",
      details: error.message,
    });
  }
});

app.listen(3000, () =>
  console.log("✅ Academic Report Generator running on port 3000")
);
