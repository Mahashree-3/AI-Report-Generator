import { generateReportPDF } from "./pdf-generator.js";

requireAuth();
document.getElementById("usernameDisplay").textContent = getUsername() || "User";

const reportsList = document.getElementById("reportsList");

async function loadReports() {
  try {
    const res = await fetch("http://localhost:3000/my-reports", {
      headers: { "Authorization": "Bearer " + getToken() },
    });
    const data = await res.json();

    if (!data.ok) {
      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }
      reportsList.innerHTML = `<div class="empty-state"><p>Could not load your reports.</p></div>`;
      return;
    }

    if (data.reports.length === 0) {
      reportsList.innerHTML = `
        <div class="empty-state">
          <p>You haven't generated any reports yet.</p>
          <a href="index.html" class="btn-new">Generate your first report</a>
        </div>`;
      return;
    }

    reportsList.innerHTML = data.reports
      .map((r) => {
        const date = new Date(r.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return `
          <div class="report-card">
            <div class="report-info">
              <h3>${escapeHtml(r.title)}</h3>
              <p>Generated on ${date}</p>
            </div>
            <button class="btn-download" data-id="${r.id}" data-title="${escapeHtml(r.title)}">
              ⬇ Download PDF
            </button>
          </div>`;
      })
      .join("");

    document.querySelectorAll(".btn-download").forEach((btn) => {
      btn.addEventListener("click", () => downloadReport(btn));
    });
  } catch (err) {
    reportsList.innerHTML = `<div class="empty-state"><p>Could not connect to server. Is server.js running?</p></div>`;
  }
}

async function downloadReport(btn) {
  const id = btn.getAttribute("data-id");
  const title = btn.getAttribute("data-title");
  btn.disabled = true;
  btn.textContent = "Preparing...";

  try {
    const res = await fetch(`http://localhost:3000/report/${id}`, {
      headers: { "Authorization": "Bearer " + getToken() },
    });
    const data = await res.json();

    if (!data.ok) {
      alert("Could not load this report: " + data.error);
      btn.disabled = false;
      btn.textContent = "⬇ Download PDF";
      return;
    }

    await generateReportPDF(title, data.report.report_text, null, "Result Screenshot");
    btn.disabled = false;
    btn.textContent = "⬇ Download PDF";
  } catch (err) {
    alert("Something went wrong while downloading.");
    btn.disabled = false;
    btn.textContent = "⬇ Download PDF";
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadReports();