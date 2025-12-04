require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// === DEPURACIÓN ===
console.log('Ruta .env:', './.env');
console.log('BD_USER:', process.env.BD_USER);
console.log('BD_PASSWORD:', process.env.BD_PASSWORD);

// === CONFIG MYSQL ===
const db = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// === MIDDLEWARES ===
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// === CONFIGURAR SESIONES ===
app.use(session({
    secret: 'tu_secreto_aqui_cambiar_en_produccion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// === VISTAS (EJS) ===
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');

// === ARCHIVOS PÚBLICOS ===
app.use(express.static(__dirname + "/../"));

// === MIDDLEWARE PARA VERIFICAR AUTENTICACIÓN ===
function verificarAutenticacion(req, res, next) {
    if (req.session.usuario) {
        next();
    } else {
        res.redirect('/signup');
    }
}

// === RUTA PRINCIPAL ===
app.get("/", (req, res) => {
    if (req.session.usuario) {
        res.redirect('/index');
    } else {
        res.redirect('/signup');
    }
});

// === RUTA SIGNUP (EJS) ===
app.get('/signup', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/index');
    }
    res.render('signup', { mensaje: "" });
});

// === SIGNUP (POST) ===
app.post("/signup", (req, res) => {
    const { nombre, email, password, rol, numeroEmpleado, matricula, grupo } = req.body;

    db.query(
        `INSERT INTO usuarios (nombre, correo, password, tipo, numero_empleado) VALUES (?, ?, ?, ?, ?)`,
        [nombre, email, password, rol, numeroEmpleado || null],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ success: false, message: "El correo ya está registrado." });
                }
                console.error("Error al registrar:", err);
                return res.status(500).json({ success: false, message: "Error al registrar usuario" });
            }

            const usuarioId = result.insertId;

            if (rol === "profesor") {
                db.query(
                    `INSERT INTO profesores (usuario_id, especialidad) VALUES (?, ?)`,
                    [usuarioId, null],
                    (err2) => {
                        if (err2) {
                            console.error("Error al crear profesor:", err2);
                            return res.status(500).json({ success: false, message: "Error al crear perfil de profesor" });
                        }
                        res.json({ success: true, message: "Registro exitoso." });
                    }
                );
            } else if (rol === "alumno") {
                db.query(
                    `INSERT INTO alumnos (usuario_id, matricula, grupo) VALUES (?, ?, ?)`,
                    [usuarioId, matricula || null, grupo || null],
                    (err2) => {
                        if (err2) {
                            console.error("Error al crear alumno:", err2);
                            return res.status(500).json({ success: false, message: "Error al crear perfil de alumno" });
                        }
                        res.json({ success: true, message: "Registro exitoso." });
                    }
                );
            }
        }
    );
});

// === RUTA LOGIN (EJS) ===
app.get('/login', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/index');
    }
    res.render('login', { mensaje: "" });
});

// === LOGIN (POST) ===
app.post("/login", (req, res) => {
    const { email, password, rol } = req.body;

    db.query(
        `SELECT * FROM usuarios WHERE correo = ? AND tipo = ?`,
        [email, rol],
        (err, results) => {
            if (err) {
                console.error("Error en consulta de login:", err);
                return res.status(500).json({ success: false, message: "Error en el servidor" });
            }

            if (results.length === 0) {
                return res.json({ success: false, message: "Credenciales incorrectas" });
            }

            const user = results[0];

            if (password !== user.password) {
                return res.json({ success: false, message: "Credenciales incorrectas" });
            }

            req.session.usuario = {
                id: user.id,
                nombre: user.nombre,
                correo: user.correo,
                tipo: user.tipo,
                numero_empleado: user.numero_empleado
            };

            res.json({ success: true, user: req.session.usuario });
        }
    );
});

// === LOGOUT ===
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
        }
        res.redirect('/signup');
    });
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
        }
        res.json({ success: true, message: "Sesión cerrada" });
    });
});

// === VERIFICAR SESIÓN ===
app.get("/verificar-sesion", (req, res) => {
    if (req.session.usuario) {
        res.json({ autenticado: true, usuario: req.session.usuario });
    } else {
        res.json({ autenticado: false });
    }
});

// ========================================
// API ENDPOINTS - MATERIAS
// ========================================

// Obtener todas las materias
app.get('/api/materias', verificarAutenticacion, (req, res) => {
    const query = `
        SELECT m.*, p.usuario_id, u.nombre as nombre_profesor
        FROM materias m
        LEFT JOIN profesores p ON m.profesor_id = p.id
        LEFT JOIN usuarios u ON p.usuario_id = u.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener materias:", err);
            return res.status(500).json({ success: false, message: "Error al obtener materias" });
        }
        res.json({ success: true, materias: results });
    });
});

// Crear nueva materia (solo profesores)
app.post('/api/materias', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo !== 'profesor') {
        return res.status(403).json({ success: false, message: "No autorizado" });
    }

    const { nombre, descripcion, horario } = req.body;

    // Obtener el profesor_id del usuario actual
    db.query(
        'SELECT id FROM profesores WHERE usuario_id = ?',
        [req.session.usuario.id],
        (err, results) => {
            if (err || results.length === 0) {
                return res.status(500).json({ success: false, message: "Error al obtener datos del profesor" });
            }

            const profesorId = results[0].id;

            db.query(
                'INSERT INTO materias (nombre, profesor_id) VALUES (?, ?)',
                [nombre, profesorId],
                (err, result) => {
                    if (err) {
                        console.error("Error al crear materia:", err);
                        return res.status(500).json({ success: false, message: "Error al crear materia" });
                    }
                    res.json({ success: true, message: "Materia creada exitosamente", id: result.insertId });
                }
            );
        }
    );
});

// ========================================
// API ENDPOINTS - TAREAS
// ========================================

// Obtener todas las tareas
app.get('/api/tareas', verificarAutenticacion, (req, res) => {
    const query = `
        SELECT t.*, m.nombre as materia_nombre
        FROM tareas t
        LEFT JOIN materias m ON t.materia_id = m.id
        ORDER BY t.fecha_entrega ASC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener tareas:", err);
            return res.status(500).json({ success: false, message: "Error al obtener tareas" });
        }
        res.json({ success: true, tareas: results });
    });
});

// Obtener tareas de hoy
app.get('/api/tareas/hoy', verificarAutenticacion, (req, res) => {
    const hoy = new Date().toISOString().split('T')[0];

    const query = `
        SELECT t.*, m.nombre as materia_nombre
        FROM tareas t
        LEFT JOIN materias m ON t.materia_id = m.id
        WHERE DATE(t.fecha_entrega) = ?
        ORDER BY t.fecha_entrega ASC
    `;

    db.query(query, [hoy], (err, results) => {
        if (err) {
            console.error("Error al obtener tareas de hoy:", err);
            return res.status(500).json({ success: false, message: "Error al obtener tareas" });
        }
        res.json({ success: true, tareas: results });
    });
});

// Crear nueva tarea (solo profesores)
app.post('/api/tareas', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo !== 'profesor') {
        return res.status(403).json({ success: false, message: "No autorizado" });
    }

    const { materia_id, titulo, descripcion, fecha_entrega } = req.body;

    db.query(
        'INSERT INTO tareas (materia_id, titulo, descripcion, fecha_entrega) VALUES (?, ?, ?, ?)',
        [materia_id, titulo, descripcion, fecha_entrega],
        (err, result) => {
            if (err) {
                console.error("Error al crear tarea:", err);
                return res.status(500).json({ success: false, message: "Error al crear tarea" });
            }
            res.json({ success: true, message: "Tarea creada exitosamente", id: result.insertId });
        }
    );
});

// ========================================
// API ENDPOINTS - PROFESORES
// ========================================

// Obtener todos los profesores
app.get('/api/profesores', verificarAutenticacion, (req, res) => {
    const query = `
        SELECT p.*, u.nombre, u.correo, u.numero_empleado
        FROM profesores p
        LEFT JOIN usuarios u ON p.usuario_id = u.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener profesores:", err);
            return res.status(500).json({ success: false, message: "Error al obtener profesores" });
        }
        res.json({ success: true, profesores: results });
    });
});

// ========================================
// API ENDPOINTS - ALUMNOS
// ========================================

// Obtener todos los alumnos
app.get('/api/alumnos', verificarAutenticacion, (req, res) => {
    const query = `
        SELECT a.*, u.nombre, u.correo
        FROM alumnos a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener alumnos:", err);
            return res.status(500).json({ success: false, message: "Error al obtener alumnos" });
        }
        res.json({ success: true, alumnos: results });
    });
});

// Buscar alumno por matrícula
app.get('/api/alumnos/buscar/:matricula', verificarAutenticacion, (req, res) => {
    const { matricula } = req.params;

    const query = `
        SELECT a.*, u.nombre, u.correo
        FROM alumnos a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.matricula = ?
    `;

    db.query(query, [matricula], (err, results) => {
        if (err) {
            console.error("Error al buscar alumno:", err);
            return res.status(500).json({ success: false, message: "Error al buscar alumno" });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: "Alumno no encontrado" });
        }

        res.json({ success: true, alumno: results[0] });
    });
});

// ========================================
// VISTAS PROTEGIDAS
// ========================================

app.get('/index', verificarAutenticacion, (req, res) => {
    res.render('index', { usuario: req.session.usuario });
});

app.get('/materias', verificarAutenticacion, (req, res) => {
    res.render('materias', { usuario: req.session.usuario });
});

app.get('/tareas', verificarAutenticacion, (req, res) => {
    res.render('tareas', { usuario: req.session.usuario });
});

app.get('/evaluaciones', verificarAutenticacion, (req, res) => {
    res.render('evaluaciones', { usuario: req.session.usuario });
});

app.get('/progreso', verificarAutenticacion, (req, res) => {
    res.render('progreso', { usuario: req.session.usuario });
});

app.get('/profesores', verificarAutenticacion, (req, res) => {
    res.render('profesores', { usuario: req.session.usuario });
});

// === INICIAR SERVIDOR ===
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});