document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rol = document.getElementById("rol").value;

  // Validaciones con expresiones regulares
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
    alert("Selecciona tu rol antes de continuar.");
    return;
  }

  // Simulación de usuarios registrados
  const usuarios = {
    "alumno@recua.com": { nombre: "Kevin Flores", password: "123456789", rol: "estudiante" },
    "profe@recua.com": { nombre: "Profa. Alma", password: "123456789", rol: "profesor" }
  };

  // Verificar credenciales
  if (usuarios[email] && usuarios[email].password === password && usuarios[email].rol === rol) {
    alert(`Bienvenido ${usuarios[email].nombre} 👋`);
    localStorage.setItem("usuarioActual", JSON.stringify(usuarios[email]));

    // Redirección según rol
    if (rol === "profesor") {
      window.location.href = "index.html";
    } else {
      window.location.href = "index.html";
    }
  } else {
    alert("Correo, contraseña o rol incorrectos ❌");
  }
});
