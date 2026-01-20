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

  // Obtener datos del usuario desde la sesión
  let userRole = "alumno"; // valor por defecto

  fetch('/verificar-sesion')
    .then(res => res.json())
    .then(data => {
      if (data.autenticado) {
        userRole = data.usuario.tipo;
        actualizarMenu();
      }
    })
    .catch(err => console.error('Error al verificar sesión:', err));

  const commonOptions = [
    { name: "Home", emoji: "🏠", page: "/index" },
    { name: "Materias", emoji: "📚", page: "/materias" },
    { name: "Tareas", emoji: "📝", page: "/tareas" },
    { name: "Progreso", emoji: "📈", page: "/progreso" },
    { name: "Perfil", emoji: "👤", page: "/perfil" },
  ];

  const teacherOptions = [
    { name: "Evaluaciones", emoji: "📊", page: "/evaluaciones" },
  ];

  function actualizarMenu() {
    const menuOptions =
      userRole === "profesor"
        ? [...commonOptions, ...teacherOptions]
        : commonOptions;

    const menuList = sidebar.querySelector("ul");
    if (!menuList) return;

    menuList.innerHTML = "";

    // Agregar opciones del menú
    menuOptions.forEach(opt => {
      const li = document.createElement("li");
      li.innerHTML = `<span style="margin-right:8px;">${opt.emoji}</span> ${opt.name}`;
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
    logoutLi.innerHTML = `<span style="margin-right:8px;">🚪</span> Cerrar Sesión`;
    logoutLi.style.color = "#f44336";
    logoutLi.style.cursor = "pointer";
    logoutLi.addEventListener("click", cerrarSesion);
    menuList.appendChild(logoutLi);

    lucide.createIcons();
  }

  // Función para cerrar sesión
  async function cerrarSesion() {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
          window.location.href = '/signup';
        } else {
          alert('Error al cerrar sesión');
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
      }
    }
  }

  // Abrir/cerrar sidebar
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Click fuera para cerrar sidebar y usuario
  document.addEventListener("click", e => {
    if (sidebar && !sidebar.contains(e.target) && toggleBtn && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove("active");
      if (userInfoSidebar) userInfoSidebar.classList.remove("active");
    }
  });

  const closeBtn = document.getElementById("closeSidebar");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }

  // Toggle info usuario
  if (userMain) {
    userMain.addEventListener("click", () => {
      if (userInfoSidebar) userInfoSidebar.classList.toggle("active");
    });
  }

  // Cerrar sesión desde el botón del sidebar de usuario
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", cerrarSesion);
  }

  /* ==========================
     YAK / ESTADÍSTICAS / RACHAS
     ========================== */
  function actualizarYak(nivel) {
    const yakImage = document.getElementById("yak-image");
    if (!yakImage) return;

    let src = "/recuaimg/fondo/YAK BASE.png";
    if (nivel >= 11) src = "/recuaimg/fondo/YAK CINTURON.png";
    else if (nivel >= 9) src = "/recuaimg/fondo/YAK ELEGANTE.jpg";
    else if (nivel >= 7) src = "/recuaimg/fondo/YAK PIRATA.jpg";
    else if (nivel >= 5) src = "/recuaimg/fondo/YAK CABALLERO.jpg";
    else if (nivel >= 3) src = "/recuaimg/fondo/YAK GRANJERO.jpg";

    yakImage.src = src;
  }

  async function updateStats() {
    try {
      const res = await fetch('/api/progreso');
      const data = await res.json();

      if (data.success) {
        const { exp, nivel, racha, mejorRacha } = data.estadisticas;

        const expFill = document.getElementById("exp-fill");
        const expText = document.getElementById("exp-text");
        const currentStreakEl = document.getElementById("current-streak");
        const bestStreakEl = document.getElementById("best-streak");

        const expNecesaria = nivel * 200;
        if (expFill) expFill.style.width = Math.min((exp / expNecesaria) * 100, 100) + "%";
        if (expText) expText.textContent = `${exp} / ${expNecesaria} exp`;
        if (currentStreakEl) currentStreakEl.textContent = racha;
        if (bestStreakEl) bestStreakEl.textContent = mejorRacha;

        actualizarYak(nivel);
      }
    } catch (err) {
      console.error('Error al actualizar estadísticas:', err);
    }
  }
  updateStats();

  /* ==========================
     DASHBOARD - Cargar datos de la BD
     ========================== */

  // Cargar tareas de hoy
  async function cargarTareasHoy() {
    const tasksTodayContainer = document.getElementById('tasks-today');
    if (!tasksTodayContainer) return;

    try {
      const response = await fetch('/api/tareas/hoy');
      const data = await response.json();

      tasksTodayContainer.innerHTML = '';

      if (data.success && data.tareas.length > 0) {
        data.tareas.forEach(tarea => {
          const div = document.createElement('div');
          div.classList.add('task-card');
          div.style.padding = "10px";
          div.style.borderRadius = "12px";
          div.style.background = "white";
          div.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
          div.style.cursor = "pointer";

          const fecha = new Date(tarea.fecha_entrega).toLocaleDateString('es-MX');

          div.innerHTML = `
            <strong>${tarea.titulo}</strong><br>
            <span>${tarea.materia_nombre || 'Sin materia'}</span><br>
            <small>${fecha}</small>
            <button class="btn-complete" onclick="completarTarea(${tarea.id})" style="margin-top:5px; padding:5px 10px; background:#4CAF50; color:white; border:none; borderRadius:5px; cursor:pointer;">Entregar</button>
          `;
          tasksTodayContainer.appendChild(div);
        });
      } else {
        tasksTodayContainer.innerHTML = '<p style="text-align:center; color:#999;">No hay tareas para hoy</p>';
      }
    } catch (error) {
      console.error('Error al cargar tareas de hoy:', error);
    }
  }

  // Función global para completar tarea
  window.completarTarea = async (id) => {
    if (!confirm('¿Estás seguro de entregar esta tarea?')) return;
    try {
      const res = await fetch(`/api/tareas/${id}/completar`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        alert('¡Tarea entregada! Has ganado 50 XP.');
        cargarTareasHoy();
        updateStats();
      } else {
        alert('Error al entregar tarea');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Cargar estadísticas de materias y tareas
  async function cargarEstadisticasDashboard() {
    try {
      // Cargar materias activas
      const responseMaterias = await fetch('/api/materias');
      const dataMaterias = await responseMaterias.json();
      const subjectsCountEl = document.getElementById('subjects-count');
      if (dataMaterias.success && subjectsCountEl) {
        subjectsCountEl.textContent = dataMaterias.materias.length;
      }

      // Cargar todas las tareas para contar
      const responseTareas = await fetch('/api/tareas');
      const dataTareas = await responseTareas.json();
      const tasksProgressEl = document.getElementById('tasks-progress');
      if (dataTareas.success && tasksProgressEl) {
        tasksProgressEl.textContent = dataTareas.tareas.length;
      }
    } catch (error) {
      console.error('Error al cargar estadísticas dashboard:', error);
    }
  }

  // Cargar próximas tareas
  async function cargarProximasTareas() {
    const upcomingTasks = document.getElementById('upcoming-tasks');
    if (!upcomingTasks) return;

    try {
      const response = await fetch('/api/tareas');
      const data = await response.json();

      upcomingTasks.innerHTML = '';

      if (data.success && data.tareas.length > 0) {
        // Mostrar las próximas 3 tareas pendientes
        const pendientes = data.tareas.filter(t => t.estado !== 'completada').slice(0, 3);
        if (pendientes.length > 0) {
          pendientes.forEach(tarea => {
            const li = document.createElement('li');
            li.innerHTML = `<span style="color:#ff9800;">•</span> ${tarea.titulo} - ${tarea.materia_nombre || 'Sin materia'}`;
            upcomingTasks.appendChild(li);
          });
        } else {
          upcomingTasks.innerHTML = '<li>No hay tareas próximas</li>';
        }
      } else {
        upcomingTasks.innerHTML = '<li>No hay tareas próximas</li>';
      }
    } catch (error) {
      console.error('Error al cargar próximas tareas:', error);
    }
  }

  // Cargar mis materias
  async function cargarMisMaterias() {
    const mySubjects = document.getElementById('my-subjects');
    if (!mySubjects) return;

    try {
      const response = await fetch('/api/materias');
      const data = await response.json();

      mySubjects.innerHTML = '';

      if (data.success && data.materias.length > 0) {
        const colores = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#ff9800'];

        data.materias.forEach((materia, index) => {
          const li = document.createElement('li');
          const color = colores[index % colores.length];
          li.innerHTML = `
            <span style="background:${color}; border-radius:50%; display:inline-block; width:10px; height:10px;"></span> 
            ${materia.nombre} - ${materia.nombre_profesor || 'Sin profesor'}
          `;
          mySubjects.appendChild(li);
        });
      } else {
        mySubjects.innerHTML = '<li>No hay materias registradas</li>';
      }
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  }

  // Inicializar funciones del dashboard
  cargarTareasHoy();
  cargarEstadisticasDashboard();
  cargarProximasTareas();
  cargarMisMaterias();

  /* ==========================
     TAREAS DINÁMICAS (PÁGINA DE TAREAS)
     ========================== */
  const tasksContainer = document.getElementById("tasks-container");
  const addTaskBtn = document.getElementById("addTaskBtn");

  async function renderTasks() {
    if (!tasksContainer) return;

    try {
      const response = await fetch('/api/tareas');
      const data = await response.json();

      tasksContainer.innerHTML = "";

      if (data.success && data.tareas.length > 0) {
        data.tareas.forEach(t => {
          const div = document.createElement("div");
          div.classList.add("task-card");
          if (t.estado === 'completada') div.style.opacity = "0.6";

          const fecha = new Date(t.fecha_entrega).toLocaleDateString('es-MX');

          div.innerHTML = `
            <h3>${t.titulo}</h3>
            <p>${t.materia_nombre || 'Sin materia'}</p>
            <p><i data-lucide="calendar"></i> ${fecha}</p>
            <div class="task-status ${t.estado}">${t.estado === 'completada' ? 'Completada' : 'Pendiente'}</div>
            ${t.estado !== 'completada' ? `<button class="btn-complete" onclick="completarTarea(${t.id})" style="margin-top:5px; padding:5px 10px; background:#4CAF50; color:white; border:none; borderRadius:5px; cursor:pointer;">Entregar</button>` : ''}
          `;
          tasksContainer.appendChild(div);
        });
        lucide.createIcons();
      } else {
        tasksContainer.innerHTML = '<p style="text-align:center; color:#999;">No hay tareas registradas</p>';
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      tasksContainer.innerHTML = '<p style="text-align:center; color:red;">Error al cargar tareas</p>';
    }
  }

  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", async () => {
      // Primero obtener las materias disponibles
      const responseMaterias = await fetch('/api/materias');
      const dataMaterias = await responseMaterias.json();

      if (!dataMaterias.success || dataMaterias.materias.length === 0) {
        alert('Primero debes crear materias');
        return;
      }

      const titulo = prompt("Nombre de la tarea:");
      if (!titulo) return;

      const descripcion = prompt("Descripción:");
      const fecha = prompt("Fecha de entrega (YYYY-MM-DD):");

      // Aquí deberías mostrar un select con las materias, pero para simplificar:
      const materiaId = dataMaterias.materias[0].id; // Toma la primera materia

      try {
        const response = await fetch('/api/tareas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            materia_id: materiaId,
            titulo: titulo,
            descripcion: descripcion,
            fecha_entrega: fecha
          })
        });

        const data = await response.json();

        if (data.success) {
          alert('Tarea creada exitosamente');
          renderTasks();
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Error al crear tarea:', error);
        alert('Error al crear tarea');
      }
    });
  }

  renderTasks();

  /* ==========================
     EVALUACIONES - Buscar alumno por matrícula
     ========================== */
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-boleta');
  const tabla = document.getElementById('tareas-lista');
  const promedioEl = document.getElementById('promedio-final');
  const alumnoInfo = document.getElementById('alumno-info');
  const nombreAlumnoEl = document.getElementById('nombre-alumno');
  const boletaAlumnoEl = document.getElementById('boleta-alumno');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', async () => {
      const matricula = searchInput.value.trim();

      if (!matricula) {
        alert('Por favor ingresa una matrícula');
        return;
      }

      try {
        const response = await fetch(`/api/alumnos/buscar/${matricula}`);
        const data = await response.json();

        if (!data.success) {
          alert('⚠️ No se encontró ningún alumno con esa matrícula.');
          if (tabla) tabla.innerHTML = `<tr><td colspan="4">No se encontró ningún alumno con esa matrícula.</td></tr>`;
          if (promedioEl) promedioEl.innerText = '-';
          if (alumnoInfo) alumnoInfo.style.display = 'none';
          return;
        }

        // Mostrar información del alumno
        if (alumnoInfo) alumnoInfo.style.display = 'block';
        if (nombreAlumnoEl) nombreAlumnoEl.textContent = data.alumno.nombre;
        if (boletaAlumnoEl) boletaAlumnoEl.textContent = `Matrícula: ${data.alumno.matricula}`;

        // Por ahora mostrar mensaje de desarrollo
        if (tabla) {
          tabla.innerHTML = `
            <tr>
              <td colspan="4" style="text-align:center; padding:20px;">
                <p>Sistema de calificaciones en desarrollo</p>
                <p>Alumno encontrado: <strong>${data.alumno.nombre}</strong></p>
                <p>Grupo: ${data.alumno.grupo}</p>
              </td>
            </tr>
          `;
        }

        if (promedioEl) promedioEl.innerText = 'N/A';

      } catch (error) {
        console.error('Error al buscar alumno:', error);
        alert('Error al buscar alumno');
      }
    });
  }

  // Cargar materias solo si estamos en la página donde existe el grid y NO es la página de materias principal (que tiene su propio script)
  // En este caso, ya que materias.ejs tiene su propio script completo, eliminamos la lógica duplicada de aquí
  // para evitar conflictos.

  // Inicializar Lucide icons
  lucide.createIcons();
});