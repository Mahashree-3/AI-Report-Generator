function getToken() {
  return localStorage.getItem("token");
}

function getUsername() {
  return localStorage.getItem("username");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

function showAlert(message, type) {
  const box = document.getElementById("alertBox");
  if (!box) return;
  box.textContent = message;
  box.className = "alert-box alert-" + type;
  box.style.display = "block";
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
  }
}