const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpiar mensaje anterior
    mensaje.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validación básica
    if (!email || !password) {
        mensaje.textContent = "Por favor, completa todos los campos.";
        return;
    }

    try {
        const res = await fetch('/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include', // IMPORTANTE: Incluir cookies de sesión
            body: JSON.stringify({ email, password })
        });

        // Asegurarse de que la respuesta sea JSON, incluso si hay error 401/500
        const data = await res.json();

        if (data.success) {
            // ÉXITO - Ya no usamos localStorage, la sesión está en el servidor
            mensaje.style.color = "green";
            mensaje.textContent = `¡Bienvenido(a), ${data.user.nombre || 'usuario'}! Redirigiendo...`;

            // Redirigir al dashboard
            setTimeout(() => {
                window.location.href = "/index"; // Cambiar a la ruta del servidor
            }, 500);

        } else {
            // FALLO DE AUTENTICACIÓN
            mensaje.style.color = "red";
            mensaje.textContent = data.message || "Credenciales incorrectas o usuario no encontrado.";
        }

    } catch (error) {
        // FALLO DE CONEXIÓN
        console.error("Error de conexión:", error);
        mensaje.style.color = "red";
        mensaje.textContent = `Error al conectar con el servidor. Asegúrate de que esté corriendo.`;
    }
});