document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rol = document.getElementById("rol").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*]{6,20}$/;

  if (!emailRegex.test(email)) {
    alert("Por favor, introduce un correo válido.");
    return;
  }

  if (!passwordRegex.test(password)) {
    alert("La contraseña debe tener entre 6 y 20 caracteres válidos.");
    return;
  }

  if (!rol) {
    alert("Selecciona tu rol.");
    return;
  }

  // Leer usuarios del localStorage
  const users = JSON.parse(localStorage.getItem("usuarios")) || {};

  if (users[email] && users[email].password === password && users[email].rol === rol) {
    alert("Inicio de sesión exitoso 🎉");
    if (rol === "profesor") {
      window.location.href = "index_profesor.html";
    } else {
      window.location.href = "index_estudiante.html";
    }
  } else {
    alert("Correo, contraseña o rol incorrectos ❌");
  }
});
