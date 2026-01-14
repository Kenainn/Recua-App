// Mostrar/ocultar campos según el rol seleccionado
document.getElementById('rol').addEventListener('change', function () {
    const rol = this.value;
    const camposAlumno = document.getElementById('camposAlumno');
    const camposProfesor = document.getElementById('camposProfesor');

    if (rol === 'alumno') {
        camposAlumno.style.display = 'block';
        camposProfesor.style.display = 'none';
        document.getElementById('matricula').required = true;
        document.getElementById('grupo').required = true;
        document.getElementById('numeroEmpleado').required = false;
    } else if (rol === 'profesor') {
        camposAlumno.style.display = 'none';
        camposProfesor.style.display = 'block';
        document.getElementById('matricula').required = false;
        document.getElementById('grupo').required = false;
        document.getElementById('numeroEmpleado').required = true;
    } else {
        camposAlumno.style.display = 'none';
        camposProfesor.style.display = 'none';
    }
});

// Manejar el envío del formulario
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;
    const matricula = document.getElementById('matricula').value;
    const grupo = document.getElementById('grupo').value;
    const numeroEmpleado = document.getElementById('numeroEmpleado').value;

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                email,
                password,
                rol,
                matricula,
                grupo,
                numeroEmpleado
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = '/login';
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar. Intenta de nuevo.');
    }
});