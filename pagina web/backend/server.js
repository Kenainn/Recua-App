require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// LOGIN
app.post("/login", (req, res) => {
  const { email, password, rol } = req.body;
  const tabla = rol === "profesor" ? "profesores" : "alumnos";

  db.query(
    `SELECT * FROM ${tabla} WHERE email = ? AND password = ?`,
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      if (results.length === 0) {
        return res.json({ success: false, message: "Credenciales incorrectas" });
      }

      res.json({ success: true, user: results[0] });
    }
  );
});

// REGISTRO
app.post("/signup", (req, res) => {
  const { nombre, email, password, rol, numeroEmpleado } = req.body;

  const tabla = rol === "profesor" ? "profesores" : "alumnos";
  const campoExtra = rol === "profesor" ? "numero_empleado" : "matricula";
  const valorExtra = rol === "profesor" ? numeroEmpleado : null;

  db.query(
    `INSERT INTO ${tabla} (nombre, email, password, ${campoExtra}) VALUES (?, ?, ?, ?)`,
    [nombre, email, password, valorExtra],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al registrar usuario" });

      res.json({ success: true });
    }
  );
});

// PUERTO USANDO .env
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log("Servidor corriendo en http://localhost:" + PORT));
