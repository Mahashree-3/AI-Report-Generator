import { jsPDF } from "jspdf";

const form = document.getElementById("reportForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const intro = document.getElementById("introduction").value;
  const literature = document.getElementById("literature").value;
  const methodology = document.getElementById("methodology").value;
  const results = document.getElementById("results").value;
  const conclusion = document.getElementById("conclusion").value;

  const doc = new jsPDF();

  // Title Page
  doc.setFontSize(20);
  doc.text(title, 105, 40, { align: "center" });
  doc.setFontSize(12);
  doc.text("Academic Project Report", 105, 55, { align: "center" });

  doc.addPage();

  // Section Helper
  const addSection = (heading, content, yStart) => {
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.text(heading, 10, yStart);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, yStart + 10);
  };

  let y = 20;
  addSection("1. Introduction", intro, y);
  doc.addPage();
  addSection("2. Literature Review", literature, 20);
  doc.addPage();
  addSection("3. Methodology", methodology, 20);
  doc.addPage();
  addSection("4. Results & Discussion", results, 20);
  doc.addPage();
  addSection("5. Conclusion", conclusion, 20);

  doc.save(`${title}-Report.pdf`);
});
