import { generateReportPDF } from "./pdf-generator.js";

const form = document.getElementById("reportForm");
const loading = document.getElementById("loading");
const downloadBtn = document.getElementById("downloadBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const workflow = document.getElementById("workflow").value.trim();
  const languages = document.getElementById("languages").value.trim();
  const imageFile = document.getElementById("resultImage").files[0];
  const figureCaption = document.getElementById("figureCaption").value.trim() || "Result Screenshot";

  loading.style.display = "block";
  downloadBtn.style.display = "none";

  const response = await fetch("http://localhost:3000/generate-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getToken(),
    },
    body: JSON.stringify({ title, description, workflow, languages }),
  });

  const data = await response.json();
  loading.style.display = "none";

  if (!data.ok) {
    if (response.status === 401 || response.status === 403) {
      alert("Session expired. Please login again.");
      logout();
      return;
    }
    alert("Error: " + data.error);
    return;
  }

  const reportText = data.reportText.trim();
  downloadBtn.style.display = "block";

  downloadBtn.onclick = () => {
    generateReportPDF(title, reportText, imageFile, figureCaption);
  };
});