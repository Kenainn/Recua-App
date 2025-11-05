/* ==========================
   SCRIPTS GENERALES - Recua
   ========================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     SIDEBAR / MENÚ / USUARIO
     ========================== */
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const userSidebar = document.getElementById("userSidebar");
  const userInfoSidebar = document.getElementById("userInfoSidebar");
  const userMain = document.querySelector(".user-main");

  // Rol temporal
  const userRole = "profesor";

  const commonOptions = [
    { name: "Home", icon: "home", page: "index.html" }, //  esto es lo que faltaba para que jale el home
    { name: "Materias", icon: "book-open", page: "materias.html" },
    { name: "Tareas", icon: "check-square", page: "tareas.html" },
    { name: "Progreso", icon: "trending-up", page: "progreso.html" },
  ];


  const teacherOptions = [
    { name: "Evaluaciones", icon: "file-check", page: "evaluaciones.html" },
  ];

  const menuOptions =
    userRole === "profesor"
      ? [...commonOptions, ...teacherOptions]
      : commonOptions;

  const menuList = sidebar.querySelector("ul");
  menuList.innerHTML = "";
  menuOptions.forEach(opt => {
    const li = document.createElement("li");
    li.innerHTML = `<i data-lucide="${opt.icon}"></i> ${opt.name}`;
    li.addEventListener("click", () => {
      window.location.href = opt.page;
    });
    menuList.appendChild(li);
  });

  lucide.createIcons();

  // Abrir/cerrar sidebar
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Click fuera para cerrar sidebar y usuario
  document.addEventListener("click", e => {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove("active");
      userInfoSidebar.classList.remove("active");
    }
  });
  const closeBtn = document.getElementById("closeSidebar");
closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});


  // Toggle info usuario
  userMain.addEventListener("click", () => {
    userInfoSidebar.classList.toggle("active");
  });

  // Cerrar sesión
  document.getElementById("logout-btn").addEventListener("click", () => {
    alert("Sesión cerrada");
  });

  // Datos simulados de usuario
  const username = "Kevin Flores";
  const userEmail = "kevinyedwin388@gmail.com";
  document.getElementById("sidebar-username-main").textContent = username;
  document.getElementById("sidebar-username").textContent = username;
  document.getElementById("sidebar-email").textContent = userEmail;
  document.getElementById("username").textContent = username;

  /* ==========================
     YAK / ESTADÍSTICAS / RACHAS
     ========================== */
  let yakLevel = 1, yakExp = 0, currentStreak = 7, bestStreak = 10, subjectsActive = 3, tasksCompleted = 5;

  function updateStats() {
    document.getElementById("exp-fill").style.width = Math.min(yakExp / (yakLevel * 200) * 100, 100) + "%";
    document.getElementById("exp-text").textContent = `${yakExp} / ${yakLevel*200} exp`;
    document.getElementById("yak-level").textContent = yakLevel;
    document.getElementById("current-streak").textContent = currentStreak;
    document.getElementById("best-streak").textContent = bestStreak;
    document.getElementById("subjects-count").textContent = subjectsActive;
    document.getElementById("tasks-progress").textContent = tasksCompleted;
  }
  updateStats();

  /* ==========================
     TAREAS DINÁMICAS
     ========================== */
  const tasksContainer = document.getElementById("tasks-container");
  const addTaskBtn = document.getElementById("addTaskBtn");
  let tasks = [
    { title:"Ensayo de literatura", subject:"Español", date:"25/10/2025", completed:false },
    { title:"Proyecto de física", subject:"Ciencias", date:"26/10/2025", completed:true },
  ];

  function renderTasks() {
    tasksContainer.innerHTML = "";
    tasks.forEach(t => {
      const div = document.createElement("div");
      div.classList.add("task-card");
      div.innerHTML = `
        <h3>${t.title}</h3>
        <p>${t.subject}</p>
        <p><i data-lucide="calendar"></i> ${t.date}</p>
        <div class="task-status ${t.completed ? "done" : "pending"}">
          ${t.completed ? "Completada" : "Pendiente"}
        </div>`;
      tasksContainer.appendChild(div);
    });
    lucide.createIcons();
  }

  if(addTaskBtn){
    addTaskBtn.addEventListener("click", () => {
      const title = prompt("Nombre de la tarea:");
      if(!title) return;
      const subject = prompt("Materia:");
      const date = prompt("Fecha (DD/MM/AAAA):");
      tasks.push({title, subject, date, completed:false});
      renderTasks();
    });
  }
  renderTasks();

  /* ==========================
     CALIFICACIONES / EVALUACIONES
     ========================== */
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-boleta');
  const tabla = document.getElementById('tareas-lista');
  const promedioEl = document.getElementById('promedio-final');
  const alumnoInfo = document.getElementById('alumno-info');
  const nombreAlumnoEl = document.getElementById('nombre-alumno');
  const boletaAlumnoEl = document.getElementById('boleta-alumno');

  // DATOS SIMULADOS DE ALUMNOS
  const alumnos = {
    "1234": {
      nombre: "Kevin Flores",
      tareas: [
        { nombre: "Tarea 1", calificacion: 9 },
        { nombre: "Tarea 2", calificacion: 7 },
        { nombre: "Tarea 3", calificacion: 8 },
      ],
      parciales: [9, 5, 7],
    },
    "20231234": {
      nombre: "José Hernández",
      tareas: [
        { nombre: "Tarea 1", calificacion: 10 },
        { nombre: "Tarea 2", calificacion: 9 },
      ],
      parciales: [10, 9, 9],
    }
  };

  // FUNCIÓN AL BUSCAR
  searchBtn.addEventListener('click', () => {
    const boleta = searchInput.value.trim();
    const alumno = alumnos[boleta];

    if (!alumno) {
      alert('⚠️ No se encontró ningún alumno con esa boleta.');
      tabla.innerHTML = `<tr><td colspan="4">No se encontró ningún alumno con esa boleta.</td></tr>`;
      promedioEl.innerText = '-';
      alumnoInfo.style.display = 'none';
      return;
    }

    // Mostrar sección del alumno
    alumnoInfo.style.display = 'block';
    nombreAlumnoEl.textContent = alumno.nombre;
    boletaAlumnoEl.textContent = `Boleta: ${boleta}`;

    // Generar tabla de tareas
    let filas = '';
    alumno.tareas.forEach((t, i) => {
      filas += `
        <tr>
          <td>${t.nombre}</td>
          <td>--</td> <!-- Fecha si quieres agregar -->
          <td><input type="number" class="grade-input" min="0" max="10" value="${t.calificacion}" data-index="${i}" /></td>
          <td><button class="save-btn" data-index="${i}">Guardar</button></td>
        </tr>`;
    });
    tabla.innerHTML = filas;

    // Calcular promedio
    const promedio = (alumno.parciales.reduce((a, b) => a + b, 0) / alumno.parciales.length).toFixed(1);
    promedioEl.innerText = promedio;

    // Botones de guardar calificación
    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const index = e.target.dataset.index;
        const nuevaCal = parseFloat(document.querySelector(`.grade-input[data-index="${index}"]`).value);
        if (!isNaN(nuevaCal) && nuevaCal >= 0 && nuevaCal <= 10) {
          alumno.tareas[index].calificacion = nuevaCal;
          alert('✅ Calificación actualizada');
        } else {
          alert('⚠️ Ingresa un valor válido entre 0 y 10');
        }
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btnAgregar = document.querySelector('.btn-green');
  const contenedor = document.querySelector('.materias-grid');

  btnAgregar.addEventListener('click', () => {
    const nombre = prompt('Nombre de la materia:');
    if (!nombre) return alert('Debes ingresar un nombre.');

    const descripcion = prompt('Descripción corta de la materia:') || 'Sin descripción';
    const profesor = prompt('Nombre del profesor(a):') || 'No asignado';
    const horario = prompt('Horario (ejemplo: Lunes y Miércoles - 10:00 a 11:30):') || 'Horario no definido';

    // Crear la tarjeta
    const nuevaMateria = document.createElement('div');
    nuevaMateria.classList.add('materia-card');

    nuevaMateria.innerHTML = `
      <div class="materia-header">
        <div class="materia-title">
          <div class="materia-icon" style="background-color: var(--accent);">
            <i class="ri-book-2-line"></i>
          </div>
          <h3>${nombre}</h3>
        </div>
        <div class="materia-actions">
          <i class="ri-edit-line"></i>
          <i class="ri-delete-bin-line"></i>
        </div>
      </div>
      <p class="materia-desc">${descripcion}</p>
      <div class="materia-profesor">
        <i class="ri-user-3-line"></i> <span>${profesor}</span>
      </div>
      <div class="materia-calendario">
        <i class="ri-calendar-line"></i> ${horario}
      </div>
      <div class="materia-footer">
        <span class="materia-estado estado-activa">Activa</span>
        <span class="materia-fecha">Inicio: ${new Date().toLocaleDateString()}</span>
      </div>
    `;

    contenedor.appendChild(nuevaMateria);
    lucide.createIcons(); // Actualiza los íconos nuevos
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btnAgregar = document.querySelector('.btn-green');
  const modal = document.getElementById('modalMateria');
  const form = document.getElementById('formMateria');
  const cancelar = document.getElementById('cancelarMateria');
  const grid = document.querySelector('.materias-grid');

  // Mostrar modal
  btnAgregar.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  // Cerrar modal
  cancelar.addEventListener('click', () => {
    modal.style.display = 'none';
    form.reset();
  });

  // Cerrar si clic fuera del modal
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Validaciones con expresiones regulares
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,20}$/;
  const regexProfesor = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\.]{3,30}$/;
  const regexHorario = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s0-9:-]+$/;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = document.getElementById('nombreMateria').value.trim();
    const descripcion = document.getElementById('descripcionMateria').value.trim();
    const profesor = document.getElementById('profesorMateria').value.trim();
    const horario = document.getElementById('horarioMateria').value.trim();

    if (!regexNombre.test(nombre)) return alert('El nombre solo puede contener letras (máx. 20 caracteres).');
    if (!regexProfesor.test(profesor)) return alert('El nombre del profesor no es válido.');
    if (!regexHorario.test(horario)) return alert('El horario contiene caracteres inválidos.');

    const nuevaMateria = document.createElement('div');
    nuevaMateria.classList.add('materia-card');
    nuevaMateria.innerHTML = `
      <div class="materia-header">
        <div class="materia-title">
          <div class="materia-icon" style="background-color: var(--accent);">
            <i class="ri-book-2-line"></i>
          </div>
          <h3>${nombre}</h3>
        </div>
        <div class="materia-actions">
          <i class="ri-edit-line"></i>
          <i class="ri-delete-bin-line"></i>
        </div>
      </div>
      <p class="materia-desc">${descripcion}</p>
      <div class="materia-profesor">
        <i class="ri-user-3-line"></i> <span>${profesor}</span>
      </div>
      <div class="materia-calendario">
        <i class="ri-calendar-line"></i> ${horario}
      </div>
      <div class="materia-footer">
        <span class="materia-estado estado-activa">Activa</span>
        <span class="materia-fecha">Inicio: ${new Date().toLocaleDateString()}</span>
      </div>
    `;
    grid.appendChild(nuevaMateria);

    lucide.createIcons();
    modal.style.display = 'none';
    form.reset();
  });
});
