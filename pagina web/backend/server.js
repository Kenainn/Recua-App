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
        secure: false, // Cambiar a true si usas HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
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
        res.redirect('/login');
    }
}

// === RUTA LOGIN (EJS) ===
app.get('/login', (req, res) => {
    // Si ya está autenticado, redirigir al dashboard
    if (req.session.usuario) {
        return res.redirect('/dashboard');
    }
    res.render('login', { mensaje: "" });
});

// === LOGIN ===
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
            
            // Comparar contraseña en texto plano
            if (password !== user.password) {
                return res.json({ success: false, message: "Credenciales incorrectas" });
            }
            
            // Guardar usuario en sesión
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
        res.redirect('/login');
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

// === DASHBOARD (PROTEGIDO) ===
app.get('/dashboard', verificarAutenticacion, (req, res) => {
    res.render('dashboard', { usuario: req.session.usuario });
});

// === SIGNUP ===
app.post("/signup", (req, res) => {
    const { nombre, email, password, rol, numeroEmpleado, matricula, grupo } = req.body;

    // Insertar en tabla usuarios
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

            // Insertar en tabla secundaria según el rol
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

// === RUTA PRINCIPAL ===
app.get("/", (req, res) => {
    if (req.session.usuario) {
        res.redirect('/dashboard');
    } else {
        res.redirect("/login");
    }
});

// === INICIAR SERVIDOR ===
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});