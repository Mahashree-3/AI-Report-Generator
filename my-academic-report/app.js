import { jsPDF } from "jspdf";

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

  // Send user input to backend
  const response = await fetch("http://localhost:3000/generate-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, workflow, languages }),
  });

  const data = await response.json();
  loading.style.display = "none";

  if (!data.ok) {
    alert("Error: " + data.error);
    return;
  }

  const reportText = data.reportText.trim();
  downloadBtn.style.display = "block";

  // 📄 When user clicks download PDF
  downloadBtn.onclick = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = 30;
    let page = 1;

    const lines = reportText.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      // 🔹 Page breaks (\f)
      if (line.includes("\f")) {
        addFooter(doc, page++);
        doc.addPage();
        y = 30;
        continue;
      }

      // 🏷️ Chapter Titles (centered + bold)
      if (/^CHAPTER\s+\d+/i.test(line.trim())) {
        addFooter(doc, page++);
        doc.addPage();
        y = 40;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(line.trim(), 105, y, { align: "center" });
        y += 10;
        continue;
      }

      // 📘 Main Headings (centered + bold)
      if (
        /^(ABSTRACT|INTRODUCTION|LITERATURE REVIEW|METHODOLOGY|IMPLEMENTATION|RESULTS AND DISCUSSION|CONCLUSION AND FUTURE ENHANCEMENT|REFERENCES)$/i.test(
          line.trim()
        )
      ) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(line.trim(), 105, y, { align: "center" });
        y += 10;
        continue;
      }

      // 🔸 Subheadings (left aligned + bold)
      if (/^\d+\.\d+\s+/.test(line.trim())) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(line.trim(), 20, y);
        y += 8;

        // 🖼️ Insert image under "5.2 Figure 1.1"
        if (/5\.2/i.test(line.trim()) && imageFile) {
          const imgData = await toBase64(imageFile);
          if (y > 180) {
            addFooter(doc, page++);
            doc.addPage();
            y = 30;
          }
          doc.addImage(imgData, "JPEG", 25, y + 10, 160, 90);
          y += 105;
          doc.setFont("helvetica", "italic");
          doc.setFontSize(12);
          doc.text(`Figure 1.1: ${figureCaption}`, 105, y, { align: "center" });
          y += 15;
        }

        continue;
      }

      // 🧾 Normal Paragraphs (justified)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const splitLines = doc.splitTextToSize(line.trim(), 170);

      for (const textLine of splitLines) {
        if (y > 270) {
          addFooter(doc, page++);
          doc.addPage();
          y = 30;
        }
        doc.text(textLine, 20, y, { align: "justify" });
        y += 7;
      }
    }

    // Add final footer
    addFooter(doc, page);

    // 💾 Save PDF
    doc.save(`${title}-Academic-Report.pdf`);
  };
});

// 🧩 Convert image file to Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}

// 📄 Footer (Page Number)
function addFooter(doc, pageNum) {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(`Page ${pageNum}`, 105, 290, { align: "center" });
}
