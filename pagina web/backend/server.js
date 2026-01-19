require('dotenv').config();
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
    host: process.env.BD_HOST || 'caboose.proxy.rlwy.net',
    user: process.env.BD_USER || 'root',
    password: process.env.BD_PASSWORD || 'jAIsHdXhOLZXSeHsWfYNchQqcqqMPgYD',
    database: process.env.BD_NAME || 'recua',
    port: process.env.BD_PORT || 24029,
    ssl: {
        rejectUnauthorized: false
    }
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
    origin: true,
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
app.use('/recuaimg', express.static(__dirname + "/../../recuaimg"));
app.use('/img', express.static(__dirname + "/../../img"));

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

// === PERFIL ===
app.get('/perfil', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo === 'alumno') {
        db.query(
            'SELECT matricula, grupo FROM alumnos WHERE usuario_id = ?',
            [req.session.usuario.id],
            (err, results) => {
                if (err) {
                    console.error('Error al obtener datos del alumno:', err);
                    return res.render('perfil', { usuario: req.session.usuario });
                }
                const usuarioCompleto = { ...req.session.usuario, ...results[0] };
                res.render('perfil', { usuario: usuarioCompleto });
            }
        );
    } else {
        res.render('perfil', { usuario: req.session.usuario });
    }
});

app.put('/api/usuario', verificarAutenticacion, (req, res) => {
    const { id } = req.session.usuario;
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo) {
        return res.status(400).json({ success: false, message: "Nombre y correo son obligatorios" });
    }

    let query = 'UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?';
    let params = [nombre, correo, id];

    if (password && password.trim() !== '') {
        query = 'UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE id = ?';
        params = [nombre, correo, password, id];
    }

    db.query(query, params, (err, result) => {
        if (err) {
            console.error("Error al actualizar perfil:", err);
            return res.status(500).json({ success: false, message: "Error al actualizar perfil" });
        }

        // Actualizar sesión
        req.session.usuario.nombre = nombre;
        req.session.usuario.correo = correo;

        res.json({ success: true, message: "Perfil actualizado exitosamente" });
    });
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

// Crear nueva materia
app.post('/api/materias', verificarAutenticacion, (req, res) => {
    const { nombre, descripcion, profesor, horario } = req.body;

    if (!nombre) {
        return res.status(400).json({ success: false, message: "El nombre es obligatorio" });
    }

    // Si es profesor, obtener su ID
    if (req.session.usuario.tipo === 'profesor') {
        db.query(
            'SELECT id FROM profesores WHERE usuario_id = ?',
            [req.session.usuario.id],
            (err, results) => {
                if (err || results.length === 0) {
                    return res.status(500).json({ success: false, message: "Error al obtener datos del profesor" });
                }

                const profesorId = results[0].id;

                db.query(
                    'INSERT INTO materias (nombre, profesor_id, descripcion, horario) VALUES (?, ?, ?, ?)',
                    [nombre, profesorId, descripcion, horario],
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
    } else {
        // Para alumnos, crear materia sin profesor asignado
        db.query(
            'INSERT INTO materias (nombre, descripcion, horario) VALUES (?, ?, ?)',
            [nombre, descripcion, horario],
            (err, result) => {
                if (err) {
                    console.error("Error al crear materia:", err);
                    return res.status(500).json({ success: false, message: "Error al crear materia" });
                }
                res.json({ success: true, message: "Materia creada exitosamente", id: result.insertId });
            }
        );
    }
});

// Actualizar materia
app.put('/api/materias/:id', verificarAutenticacion, (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, horario, profesor } = req.body;

    if (!nombre || !horario) {
        return res.status(400).json({ success: false, message: "Nombre y horario son obligatorios" });
    }

    // Nota: Estamos actualizando el campo de texto 'profesor' recién agregado.
    // Si se quisiera mantener la relación con ID, se requeriría lógica adicional para buscar el ID.
    db.query(
        'UPDATE materias SET nombre = ?, descripcion = ?, horario = ?, profesor = ? WHERE id = ?',
        [nombre, descripcion, horario, profesor, id],
        (err, result) => {
            if (err) {
                console.error("Error al actualizar materia:", err);
                return res.status(500).json({ success: false, message: "Error al actualizar materia" });
            }
            res.json({ success: true, message: "Materia actualizada exitosamente" });
        }
    );
});

// Eliminar materia
app.delete('/api/materias/:id', verificarAutenticacion, (req, res) => {
    const { id } = req.params;

    // Primero eliminamos las tareas asociadas a esta materia
    db.query(
        'DELETE FROM tareas WHERE materia_id = ?',
        [id],
        (errTasks) => {
            if (errTasks) {
                console.error("Error al eliminar tareas asociadas:", errTasks);
                // No retornamos error fatal, intentamos borrar la materia de todas formas o avisamos
                // Pero lo ideal es limpiar antes. Si falla, probablemente la materia no se borre si hay FK.
            }

            // Ahora eliminamos la materia
            db.query(
                'DELETE FROM materias WHERE id = ?',
                [id],
                (err, result) => {
                    if (err) {
                        console.error("Error al eliminar materia:", err);
                        return res.status(500).json({ success: false, message: "Error al eliminar materia (puede tener datos asociados)" });
                    }
                    res.json({ success: true, message: "Materia y sus tareas eliminadas exitosamente" });
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

// Crear nueva tarea (todos)
app.post('/api/tareas', verificarAutenticacion, (req, res) => {
    // Se eliminó la restricción de solo profesores

    const { materia_id, titulo, descripcion, fecha_entrega, dificultad } = req.body;
    let xp_reward = 50;

    switch (dificultad) {
        case 'facil': xp_reward = 50; break;
        case 'medio': xp_reward = 100; break;
        case 'dificil': xp_reward = 200; break;
        default: xp_reward = 50;
    }

    db.query(
        'INSERT INTO tareas (materia_id, titulo, descripcion, fecha_entrega, dificultad, xp_reward) VALUES (?, ?, ?, ?, ?, ?)',
        [materia_id, titulo, descripcion, fecha_entrega, dificultad || 'facil', xp_reward],
        (err, result) => {
            if (err) {
                console.error("Error al crear tarea:", err);
                return res.status(500).json({ success: false, message: "Error al crear tarea" });
            }
            res.json({ success: true, message: "Tarea creada exitosamente", id: result.insertId });
        }
    );
});

// Actualizar tarea
app.put('/api/tareas/:id', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo !== 'profesor') {
        return res.status(403).json({ success: false, message: "No autorizado" });
    }

    const { id } = req.params;
    const { materia_id, titulo, descripcion, fecha_entrega } = req.body;

    db.query(
        'UPDATE tareas SET materia_id = ?, titulo = ?, descripcion = ?, fecha_entrega = ? WHERE id = ?',
        [materia_id, titulo, descripcion, fecha_entrega, id],
        (err, result) => {
            if (err) {
                console.error("Error al actualizar tarea:", err);
                return res.status(500).json({ success: false, message: "Error al actualizar tarea" });
            }
            res.json({ success: true, message: "Tarea actualizada exitosamente" });
        }
    );
});

// Eliminar tarea
app.delete('/api/tareas/:id', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo !== 'profesor') {
        return res.status(403).json({ success: false, message: "No autorizado" });
    }

    const { id } = req.params;

    db.query(
        'DELETE FROM tareas WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error("Error al eliminar tarea:", err);
                return res.status(500).json({ success: false, message: "Error al eliminar tarea" });
            }
            res.json({ success: true, message: "Tarea eliminada exitosamente" });
        }
    );
});

// Marcar tarea como completada y actualizar progreso
app.put('/api/tareas/:id/completar', verificarAutenticacion, (req, res) => {
    const { id } = req.params;
    const usuarioId = req.session.usuario.id;

    db.query(
        'UPDATE tareas SET estado = "completada" WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error("Error al completar tarea:", err);
                return res.status(500).json({ success: false, message: "Error al completar tarea" });
            }

            // Lógica de XP y Rachas
            db.query(
                'SELECT exp, nivel, racha_actual, mejor_racha, ultima_tarea_fecha FROM usuarios WHERE id = ?',
                [usuarioId],
                (err2, results) => {
                    if (err2 || results.length === 0) return res.json({ success: true, message: "Tarea completada (error al actualizar XP)" });

                    let { exp, nivel, racha_actual, mejor_racha, ultima_tarea_fecha } = results[0];
                    const hoy = new Date().toISOString().split('T')[0];

                    // Sumar XP
                    const tareaXp = results[0].xp_reward || 0; // Se asume que se hizo un JOIN, pero la query actual no trae xp_reward de tareas

                    // Solución: Hacer primero query de la tarea para saber su XP reward o traerlo desde el update/param de tarea?
                    // Corrección: La query principal no tiene datos de tareas, solo de usuarios.
                    // Necesitamos saber cuánta XP da esta tarea.

                    db.query('SELECT xp_reward FROM tareas WHERE id = ?', [id], (errTask, resTask) => {
                        if (errTask || resTask.length === 0) {
                            // Default si falla
                            exp += 50;
                        } else {
                            exp += resTask[0].xp_reward;
                        }

                        if (exp >= nivel * 200) {
                            exp -= nivel * 200;
                            nivel += 1;
                        }

                        // Actualizar Racha
                        if (!ultima_tarea_fecha || ultima_tarea_fecha !== hoy) {
                            const ayer = new Date();
                            ayer.setDate(ayer.getDate() - 1);
                            const ayerStr = ayer.toISOString().split('T')[0];

                            if (ultima_tarea_fecha === ayerStr) {
                                racha_actual += 1;
                            } else {
                                racha_actual = 1;
                            }

                            if (racha_actual > mejor_racha) {
                                mejor_racha = racha_actual;
                            }
                        }

                        db.query(
                            'UPDATE usuarios SET exp = ?, nivel = ?, racha_actual = ?, mejor_racha = ?, ultima_tarea_fecha = ? WHERE id = ?',
                            [exp, nivel, racha_actual, mejor_racha, hoy, usuarioId],
                            (err3) => {
                                if (err3) console.error("Error al actualizar progreso:", err3);
                                res.json({
                                    success: true,
                                    message: "Tarea completada y progreso actualizado",
                                    progreso: { exp, nivel, racha_actual, mejor_racha }
                                });
                            }
                        );
                    });
                }
            );
        }
    );
});

// Deshacer tarea completada (volver a pendiente)
app.put('/api/tareas/:id/deshacer', verificarAutenticacion, (req, res) => {
    const { id } = req.params;

    db.query(
        'UPDATE tareas SET estado = "pendiente" WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error("Error al deshacer tarea:", err);
                return res.status(500).json({ success: false, message: "Error al deshacer tarea" });
            }
            res.json({ success: true, message: "Tarea marcada como pendiente" });
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
// API ENDPOINTS - PROGRESO
// ========================================

// Obtener progreso del usuario
app.get('/api/progreso', verificarAutenticacion, (req, res) => {
    const usuarioId = req.session.usuario.id;

    db.query(
        'SELECT exp, nivel, racha_actual, mejor_racha FROM usuarios WHERE id = ?',
        [usuarioId],
        (err, results) => {
            if (err || results.length === 0) {
                return res.status(500).json({ success: false, message: "Error al obtener progreso" });
            }

            const { exp, nivel, racha_actual, mejor_racha } = results[0];

            res.json({
                success: true,
                usuario: req.session.usuario,
                estadisticas: {
                    exp,
                    nivel,
                    racha: racha_actual,
                    mejorRacha: mejor_racha,
                    tareasCompletadas: 0
                }
            });
        }
    );
});

// ========================================
// VISTAS PROTEGIDAS
// ========================================

app.get('/index', verificarAutenticacion, (req, res) => {
    // Obtener información adicional del usuario
    if (req.session.usuario.tipo === 'alumno') {
        db.query(
            'SELECT matricula, grupo FROM alumnos WHERE usuario_id = ?',
            [req.session.usuario.id],
            (err, results) => {
                if (err) {
                    console.error('Error al obtener datos del alumno:', err);
                    return res.render('index', { usuario: req.session.usuario });
                }
                const usuarioCompleto = { ...req.session.usuario, ...results[0] };
                res.render('index', { usuario: usuarioCompleto });
            }
        );
    } else {
        res.render('index', { usuario: req.session.usuario });
    }
});

app.get('/materias', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo === 'alumno') {
        db.query(
            'SELECT matricula, grupo FROM alumnos WHERE usuario_id = ?',
            [req.session.usuario.id],
            (err, results) => {
                if (err) {
                    console.error('Error al obtener datos del alumno:', err);
                    return res.render('materias', { usuario: req.session.usuario });
                }
                const usuarioCompleto = { ...req.session.usuario, ...results[0] };
                res.render('materias', { usuario: usuarioCompleto });
            }
        );
    } else {
        res.render('materias', { usuario: req.session.usuario });
    }
});

app.get('/tareas', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo === 'alumno') {
        db.query(
            'SELECT matricula, grupo FROM alumnos WHERE usuario_id = ?',
            [req.session.usuario.id],
            (err, results) => {
                if (err) {
                    console.error('Error al obtener datos del alumno:', err);
                    return res.render('tareas', { usuario: req.session.usuario });
                }
                const usuarioCompleto = { ...req.session.usuario, ...results[0] };
                res.render('tareas', { usuario: usuarioCompleto });
            }
        );
    } else {
        res.render('tareas', { usuario: req.session.usuario });
    }
});

app.get('/evaluaciones', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo === 'alumno') {
        db.query(
            'SELECT matricula, grupo FROM alumnos WHERE usuario_id = ?',
            [req.session.usuario.id],
            (err, results) => {
                if (err) {
                    console.error('Error al obtener datos del alumno:', err);
                    return res.render('evaluaciones', { usuario: req.session.usuario });
                }
                const usuarioCompleto = { ...req.session.usuario, ...results[0] };
                res.render('evaluaciones', { usuario: usuarioCompleto });
            }
        );
    } else {
        res.render('evaluaciones', { usuario: req.session.usuario });
    }
});

app.get('/progreso', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo === 'alumno') {
        db.query(
            'SELECT matricula, grupo FROM alumnos WHERE usuario_id = ?',
            [req.session.usuario.id],
            (err, results) => {
                if (err) {
                    console.error('Error al obtener datos del alumno:', err);
                    return res.render('progreso', { usuario: req.session.usuario });
                }
                const usuarioCompleto = { ...req.session.usuario, ...results[0] };
                res.render('progreso', { usuario: usuarioCompleto });
            }
        );
    } else {
        res.render('progreso', { usuario: req.session.usuario });
    }
});

app.get('/profesores', verificarAutenticacion, (req, res) => {
    if (req.session.usuario.tipo === 'alumno') {
        db.query(
            'SELECT matricula, grupo FROM alumnos WHERE usuario_id = ?',
            [req.session.usuario.id],
            (err, results) => {
                if (err) {
                    console.error('Error al obtener datos del alumno:', err);
                    return res.render('profesores', { usuario: req.session.usuario });
                }
                const usuarioCompleto = { ...req.session.usuario, ...results[0] };
                res.render('profesores', { usuario: usuarioCompleto });
            }
        );
    } else {
        res.render('profesores', { usuario: req.session.usuario });
    }
});

// === INICIAR SERVIDOR ===
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});