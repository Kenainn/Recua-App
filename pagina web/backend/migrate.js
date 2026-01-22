const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

const db = mysql.createConnection({
    host: process.env.BD_HOST || 'caboose.proxy.rlwy.net',
    user: process.env.BD_USER || 'root',
    password: process.env.BD_PASSWORD || 'jAIsHdXhOLZXSeHsWfYNchQqcqqMPgYD',
    database: process.env.BD_NAME || 'railway',
    port: process.env.BD_PORT || 24029,
    ssl: { rejectUnauthorized: false }
});

db.connect();

async function run() {
    console.log("Iniciando migración...");
    try {
        await db.promise().query("ALTER TABLE materias ADD COLUMN usuario_id INT AFTER profesor_id");
        console.log("Columna usuario_id añadida a materias");
    } catch (e) {
        console.log("Columna usuario_id ya existe en materias o error:", e.message);
    }

    try {
        await db.promise().query("ALTER TABLE tareas ADD COLUMN usuario_id INT AFTER materia_id");
        console.log("Columna usuario_id añadida a tareas");
    } catch (e) {
        console.log("Columna usuario_id ya existe en tareas o error:", e.message);
    }

    // Actualizar datos existentes (opcional, para no perder lo que ya hay)
    // Pero el usuario quiere "limpio", así que tal vez mejor dejarlo así.

    db.end();
}

run().catch(console.error);
