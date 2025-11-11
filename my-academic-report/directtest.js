import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testGeminiDirect() {
  const body = {
    contents: [
      {
        parts: [{ text: "Say 'Hello! Gemini 2.5 Flash is working!'" }],
      },
    ],
  };

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    if (res.ok) {
      console.log("✅ Gemini API key is working perfectly!");
      console.log("Response:", data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      console.error("❌ API error:", data);
    }
  } catch (err) {
    console.error("❌ Network or key issue:", err);
  }
}

testGeminiDirect();
