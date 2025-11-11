# 🧠 AI Report Generator

The **AI Report Generator** is a web-based application that allows users to generate complete academic reports automatically using AI.  
Users provide project details such as **title, abstract, workflow, results, images, and technologies used**, and the system generates a formatted academic report which can be downloaded as a **PDF**.

---

## 🚀 Features

✅ Generate academic reports using AI  
✅ Upload images and include them inside the final PDF  
✅ Supports dynamic headings and subheadings  
✅ User-friendly UI for entering project details  
✅ Backend powered by Google Gemini API  
✅ Clean and structured PDF output  
✅ Fast and accurate report generation  

---

## 🏗️ Tech Stack

### **Frontend**
- HTML  
- CSS  
- JavaScript  
- Tailwind CSS  
- HTML2Canvas (for screenshot support)

### **Backend**
- Node.js  
- Express.js  
- Google Gemini API  

### **Other Tools**
- Git & GitHub  
- PDF Generation Libraries  
- Browser File APIs  

---

## 📁 Project Structure

academic-report/
│── my-academic-report/
│ ├── index.html
│ ├── app.js
│ ├── style.css
│ ├── assets/
│── server.js
│── package.json
│── package-lock.json
│── README.md


---

## ⚙️ How It Works

1️⃣ User enters report details  
2️⃣ Frontend sends the data to Node.js backend  
3️⃣ Backend calls Google Gemini API  
4️⃣ AI generates structured content (introduction, workflow, description, results...)  
5️⃣ Application renders the content dynamically  
6️⃣ User downloads the final report as a **PDF**  

---

## ▶️ Running the Project Locally

### ✅ Install Dependencies
```bash
npm install

✅ Open the Frontend

Open index.html in your browser.

🔑 Environment Variables

Create a .env file in your project root and add:

GEMINI_API_KEY=your_api_key_here

📦 Build & Deployment

You can deploy this project using:

✅ Netlify / Vercel (Frontend)

✅ Render / Railway / Heroku (Backend)

💡 Future Improvements

✅ Multi-page PDF support
✅ Styling templates (IEEE, APA, college-specific)
✅ Save projects to database
✅ Login & dashboard
