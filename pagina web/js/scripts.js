// Sidebar toggle
const sidebar = document.getElementById("sidebar");
document.getElementById("toggleSidebar").addEventListener("click", ()=>sidebar.classList.toggle("active"));

// Usuario mini barra
const userSidebar = document.getElementById("userSidebar");
const userInfoSidebar = document.getElementById("userInfoSidebar");

userSidebar.addEventListener("click", (e) => {
  e.stopPropagation();
  userSidebar.classList.toggle("active");
});

// Cerrar la barra si se hace clic fuera
document.addEventListener("click", (e) => {
  if (!userSidebar.contains(e.target)) {
    userSidebar.classList.remove("active");
  }
});

const closeSidebar = document.getElementById("closeSidebar");
closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

// Logout
document.getElementById("logout-btn").addEventListener("click", ()=>alert("Sesión cerrada"));

// Yak y estadísticas
let yakLevel=1, yakExp=0, currentStreak=7, bestStreak=10, subjectsActive=3, tasksCompleted=5;
function updateStats(){
  document.getElementById("exp-fill").style.width = Math.min(yakExp/200*100,100)+"%";
  document.getElementById("exp-text").textContent = `${yakExp} / ${yakLevel*200} exp`;
  document.getElementById("yak-level").textContent = yakLevel;
  document.getElementById("current-streak").textContent = currentStreak;
  document.getElementById("best-streak").textContent = bestStreak;
  document.getElementById("subjects-count").textContent = subjectsActive;
  document.getElementById("tasks-progress").textContent = tasksCompleted;
}
updateStats();

// Tareas dinámicas
const tasksContainer = document.getElementById("tasks-container");
const addTaskBtn = document.getElementById("addTaskBtn");
let tasks = [
  { title:"Ensayo de literatura", subject:"Español", date:"25/10/2025", completed:false },
  { title:"Proyecto de física", subject:"Ciencias", date:"26/10/2025", completed:true },
];
function renderTasks(){
  tasksContainer.innerHTML="";
  tasks.forEach(t=>{
    const div = document.createElement("div");
    div.classList.add("task-card");
    div.innerHTML=`<h3>${t.title}</h3><p>${t.subject}</p><p><i data-lucide="calendar"></i> ${t.date}</p>
    <div class="task-status ${t.completed?"done":"pending"}">${t.completed?"Completada":"Pendiente"}</div>`;
    tasksContainer.appendChild(div);
  });
  lucide.createIcons();
}
addTaskBtn.addEventListener("click", ()=>{
  const title=prompt("Nombre de la tarea:");
  if(!title) return;
  const subject=prompt("Materia:");
  const date=prompt("Fecha (DD/MM/AAAA):");
  tasks.push({title,subject,date,completed:false});
  renderTasks();
});
renderTasks();
