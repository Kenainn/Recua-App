const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

const db = mysql.createConnection({
    host: process.env.BD_HOST || 'caboose.proxy.rlwy.net',
    user: process.env.BD_USER || 'root',
    password: process.env.BD_PASSWORD || 'jAIsHdXhOLZXSeHsWfYNchQqcqqMPgYD',
    database: process.env.BD_NAME || 'recua',
    port: process.env.BD_PORT || 24029,
    ssl: { rejectUnauthorized: false }
});

db.connect();

const queries = [
    "DESCRIBE materias",
    "DESCRIBE tareas",
    "DESCRIBE alumnos",
    "SHOW TABLES"
];

let results = {};

async function run() {
    for (const q of queries) {
        const [res] = await db.promise().query(q);
        results[q] = res;
    }
    console.log(JSON.stringify(results, null, 2));
    db.end();
}

run().catch(console.error);
