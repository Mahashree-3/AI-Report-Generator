import { jsPDF } from "jspdf";

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}

function addFooter(doc, pageNum) {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(`Page ${pageNum}`, 105, 290, { align: "center" });
}

export async function generateReportPDF(title, reportText, imageFile, figureCaption) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 30;
  let page = 1;

  const lines = reportText.split("\n").filter((line) => line.trim() !== "");

  for (const line of lines) {
    if (line.includes("\f")) {
      addFooter(doc, page++);
      doc.addPage();
      y = 30;
      continue;
    }

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

    if (/^\d+\.\d+\s+/.test(line.trim())) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(line.trim(), 20, y);
      y += 8;

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
        doc.text(`Figure 1.1: ${figureCaption || "Result Screenshot"}`, 105, y, { align: "center" });
        y += 15;
      }

      continue;
    }

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

  addFooter(doc, page);
  doc.save(`${title}-Academic-Report.pdf`);
}