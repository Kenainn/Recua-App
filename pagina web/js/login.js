const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rol = document.getElementById("rol").value;

  try {
    const res = await fetch("http://localhost:5050/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, rol })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("usuario", JSON.stringify(data.user));
      localStorage.setItem("rol", rol);

      window.location.href = "./index.html";
    } else {
      mensaje.textContent = "Credenciales incorrectas o usuario no encontrado.";
    }

  } catch (error) {
    mensaje.textContent = "Error al conectar con el servidor.";
  }
});
