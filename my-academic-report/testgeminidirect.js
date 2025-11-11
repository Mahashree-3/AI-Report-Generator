import fetch from "node-fetch";

// ✅ Your Verified Gemini API Key
const GEMINI_API_KEY = "AIzaSyDWx-6PYr1x7Vh61pW9oDrj4L0i9ffqkrE";

async function testGemini() {
  const prompt = "Write a short academic abstract on Artificial Intelligence in Education.";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log("\n✅ Success! Gemini says:\n");
      console.log(data.candidates[0].content.parts[0].text);
    } else {
      console.error("\n❌ Error from API:\n", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Request Failed:", error.message);
  }
}

testGemini();
