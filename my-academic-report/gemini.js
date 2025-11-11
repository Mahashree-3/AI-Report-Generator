import { GoogleGenerativeAI } from "@google/generative-ai";

// Use your valid API key
const genAI = new GoogleGenerativeAI("AIzaSyAnxLKInlCaU7wCT39Y3qEGq8-hjaLXUN8");

async function generateReport(projectName, description, workflow, languageUsed) {
  // ✅ Use the stable model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // ✅ Dynamic academic-style prompt
  const prompt = `
You are an AI academic report writer.
Create a structured academic project report for the following details:

Project Name: ${projectName}
Description: ${description}
Workflow: ${workflow}
Languages Used: ${languageUsed}

The report should include these sections:
1. ABSTRACT
2. INTRODUCTION
3. LITERATURE REVIEW
4. METHODOLOGY
5. IMPLEMENTATION
6. RESULTS AND DISCUSSION
7. CONCLUSION
8. FUTURE SCOPE
9. REFERENCES

Use formal academic English and generate multi-paragraph text in plain format (no Markdown).
`;

  try {
    const result = await model.generateContent(prompt);

    // ✅ Extract and display the response text
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error("Error generating report:", error);
  }
}

// Example use
generateReport(
  "AI-Powered Chatbot System",
  "A chatbot that uses Gemini API to provide intelligent academic responses.",
  "Data preprocessing → Prompt design → Model integration → Frontend interface → Evaluation",
  "JavaScript, Node.js, Python"
);
