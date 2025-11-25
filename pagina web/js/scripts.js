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

  // Rol temporal - esto se puede obtener del servidor
  const userRole = "profesor";

  const commonOptions = [
    { name: "Home", icon: "home", page: "index.html" },
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
  
  // Agregar opciones del menú
  menuOptions.forEach(opt => {
    const li = document.createElement("li");
    li.innerHTML = `<i data-lucide="${opt.icon}"></i> ${opt.name}`;
    li.addEventListener("click", () => {
      window.location.href = opt.page;
    });
    menuList.appendChild(li);
  });

  // Agregar separador y botón de cerrar sesión
  const separador = document.createElement("hr");
  separador.style.margin = "10px 0";
  separador.style.border = "none";
  separador.style.borderTop = "1px solid #e0e0e0";
  menuList.appendChild(separador);

  const logoutLi = document.createElement("li");
  logoutLi.innerHTML = `<i data-lucide="log-out"></i> Cerrar Sesión`;
  logoutLi.style.color = "#f44336";
  logoutLi.style.cursor = "pointer";
  logoutLi.addEventListener("click", async () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      try {
        const response = await fetch('http://localhost:3000/logout', {
          method: 'POST',
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
          window.location.href = '/login';
        } else {
          alert('Error al cerrar sesión');
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
      }
    }
  });
  menuList.appendChild(logoutLi);

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

  // Cerrar sesión desde el botón del sidebar de usuario
  document.getElementById("logout-btn").addEventListener("click", async () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      try {
        const response = await fetch('http://localhost:3000/logout', {
          method: 'POST',
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
          window.location.href = '/login';
        } else {
          alert('Error al cerrar sesión');
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
      }
    }
  });

  // Datos simulados de usuario (esto debería venir del servidor)
  const username = "Prepucio Lopez";
  const userEmail = "kevinyedwin388@gmail.com";
  
  // Verificar si los elementos existen antes de actualizar
  const sidebarUsernameMain = document.getElementById("sidebar-username-main");
  const sidebarUsername = document.getElementById("sidebar-username");
  const sidebarEmail = document.getElementById("sidebar-email");
  const usernameDisplay = document.getElementById("username");
  
  if (sidebarUsernameMain) sidebarUsernameMain.textContent = username;
  if (sidebarUsername) sidebarUsername.textContent = username;
  if (sidebarEmail) sidebarEmail.textContent = userEmail;
  if (usernameDisplay) usernameDisplay.textContent = username;

  /* ==========================
     YAK / ESTADÍSTICAS / RACHAS
     ========================== */
  let yakLevel = 1, yakExp = 40, currentStreak = 7, bestStreak = 10, subjectsActive = 3, tasksCompleted = 5;

  function updateStats() {
    const expFill = document.getElementById("exp-fill");
    const expText = document.getElementById("exp-text");
    const yakLevelEl = document.getElementById("yak-level");
    const currentStreakEl = document.getElementById("current-streak");
    const bestStreakEl = document.getElementById("best-streak");
    const subjectsCountEl = document.getElementById("subjects-count");
    const tasksProgressEl = document.getElementById("tasks-progress");
    
    if (expFill) expFill.style.width = Math.min(yakExp / (yakLevel * 200) * 100, 100) + "%";
    if (expText) expText.textContent = `${yakExp} / ${yakLevel*200} exp`;
    if (yakLevelEl) yakLevelEl.textContent = yakLevel;
    if (currentStreakEl) currentStreakEl.textContent = currentStreak;
    if (bestStreakEl) bestStreakEl.textContent = bestStreak;
    if (subjectsCountEl) subjectsCountEl.textContent = subjectsActive;
    if (tasksProgressEl) tasksProgressEl.textContent = tasksCompleted;
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
    if (!tasksContainer) return;
    
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

  if (searchBtn && searchInput && tabla) {
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
        if (promedioEl) promedioEl.innerText = '-';
        if (alumnoInfo) alumnoInfo.style.display = 'none';
        return;
      }

      // Mostrar sección del alumno
      if (alumnoInfo) alumnoInfo.style.display = 'block';
      if (nombreAlumnoEl) nombreAlumnoEl.textContent = alumno.nombre;
      if (boletaAlumnoEl) boletaAlumnoEl.textContent = `Boleta: ${boleta}`;

      // Generar tabla de tareas
      let filas = '';
      alumno.tareas.forEach((t, i) => {
        filas += `
          <tr>
            <td>${t.nombre}</td>
            <td>--</td>
            <td><input type="number" class="grade-input" min="0" max="10" value="${t.calificacion}" data-index="${i}" /></td>
            <td><button class="save-btn" data-index="${i}">Guardar</button></td>
          </tr>`;
      });
      tabla.innerHTML = filas;

      // Calcular promedio
      const promedio = (alumno.parciales.reduce((a, b) => a + b, 0) / alumno.parciales.length).toFixed(1);
      if (promedioEl) promedioEl.innerText = promedio;

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
  }
});

// MATERIAS - Agregar nueva materia (Modal)
document.addEventListener('DOMContentLoaded', () => {
  const btnAgregar = document.querySelector('.btn-green');
  const modal = document.getElementById('modalMateria');
  const form = document.getElementById('formMateria');
  const cancelar = document.getElementById('cancelarMateria');
  const grid = document.querySelector('.materias-grid');

  if (!btnAgregar || !modal || !form) return;

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