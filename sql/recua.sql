DROP DATABASE IF EXISTS recua;
CREATE DATABASE recua;
USE recua;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    tipo ENUM('alumno','profesor'),
    numero_empleado INT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    matricula VARCHAR(20) UNIQUE,
    grupo VARCHAR(10),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE profesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    especialidad VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    profesor_id INT,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id)
);

CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    materia_id INT,
    titulo VARCHAR(200),
    descripcion TEXT,
    fecha_entrega DATE,
    FOREIGN KEY (materia_id) REFERENCES materias(id)
);

-- ======================================
-- INSERTAR PROFESORES (5)
-- ======================================
INSERT INTO usuarios (nombre, correo, password, tipo, numero_empleado)
VALUES
('Luis Hernández', 'lhernandez@escuela.mx', '12345', 'profesor', 1001),
('María Soto', 'msoto@escuela.mx', '12345', 'profesor', 1002),
('Carlos Ramos', 'cramos@escuela.mx', '12345', 'profesor', 1003),
('Ana López', 'alopez@escuela.mx', '12345', 'profesor', 1004),
('Jorge Ramírez', 'jramirez@escuela.mx', '12345', 'profesor', 1005);

INSERT INTO profesores (usuario_id, especialidad)
VALUES
(1, 'Matemáticas'),
(2, 'Física'),
(3, 'Programación'),
(4, 'Inglés'),
(5, 'Historia');

-- ======================================
-- INSERTAR ALUMNOS (20)
-- ======================================
INSERT INTO usuarios (nombre, correo, password, tipo)
VALUES
('Kevin Martínez', 'kevin1@escuela.mx', '12345', 'alumno'),
('José Aguilar', 'jose2@escuela.mx', '12345', 'alumno'),
('Luis Torres', 'luis3@escuela.mx', '12345', 'alumno'),
('Mario Sánchez', 'mario4@escuela.mx', '12345', 'alumno'),
('Axel Jiménez', 'axel5@escuela.mx', '12345', 'alumno'),
('Ana Pérez', 'ana6@escuela.mx', '12345', 'alumno'),
('Laura García', 'laura7@escuela.mx', '12345', 'alumno'),
('Sofía Ruiz', 'sofia8@escuela.mx', '12345', 'alumno'),
('Marcos Rivera', 'marcos9@escuela.mx', '12345', 'alumno'),
('Omar López', 'omar10@escuela.mx', '12345', 'alumno'),
('Diana Romero', 'diana11@escuela.mx', '12345', 'alumno'),
('Paola Díaz', 'paola12@escuela.mx', '12345', 'alumno'),
('Miguel Castillo', 'miguel13@escuela.mx', '12345', 'alumno'),
('Raúl Silva', 'raul14@escuela.mx', '12345', 'alumno'),
('Fabiola Méndez', 'fabi15@escuela.mx', '12345', 'alumno'),
('Erick Navarro', 'erick16@escuela.mx', '12345', 'alumno'),
('Hugo Cruz', 'hugo17@escuela.mx', '12345', 'alumno'),
('Brenda Flores', 'brenda18@escuela.mx', '12345', 'alumno'),
('Daniel Rojas', 'daniel19@escuela.mx', '12345', 'alumno'),
('Karla Lozano', 'karla20@escuela.mx', '12345', 'alumno');

INSERT INTO alumnos (usuario_id, matricula, grupo)
VALUES
(6, 'A001', '5IV8'),
(7, 'A002', '5IV8'),
(8, 'A003', '5IV8'),
(9, 'A004', '5IV8'),
(10, 'A005', '5IV8'),
(11, 'A006', '5IV8'),
(12, 'A007', '5IV8'),
(13, 'A008', '5IV8'),
(14, 'A009', '5IV8'),
(15, 'A010', '5IV8'),
(16, 'A011', '5IV8'),
(17, 'A012', '5IV8'),
(18, 'A013', '5IV8'),
(19, 'A014', '5IV8'),
(20, 'A015', '5IV8'),
(21, 'A016', '5IV8'),
(22, 'A017', '5IV8'),
(23, 'A018', '5IV8'),
(24, 'A019', '5IV8'),
(25, 'A020', '5IV8');

-- ======================================
-- MATERIAS (5)
-- ======================================
INSERT INTO materias (nombre, profesor_id)
VALUES
('Matemáticas', 1),
('Física', 2),
('Programación', 3),
('Inglés', 4),
('Historia', 5);

-- ======================================
-- TAREAS (10)
-- ======================================
INSERT INTO tareas (materia_id, titulo, descripcion, fecha_entrega)
VALUES
(1, 'Álgebra Lineal', 'Resolver 15 ejercicios.', '2025-11-20'),
(1, 'Geometría Analítica', 'Investigar sobre cónicas.', '2025-11-25'),
(2, 'Caída Libre', 'Hacer reporte.', '2025-11-22'),
(2, 'Leyes de Newton', 'Ejercicios del 1 al 20.', '2025-11-28'),
(3, 'Funciones JS', 'Hacer 5 funciones.', '2025-11-30'),
(3, 'DOM Manipulación', 'Crear mini página web.', '2025-12-02'),
(4, 'Listening A2', 'Completar guía.', '2025-11-19'),
(4, 'Verbos Pasado', 'Escribir 10 oraciones.', '2025-11-23'),
(5, 'Independencia', 'Resumen de 1 cuartilla.', '2025-11-27'),
(5, 'Revolución Mexicana', 'Infografía.', '2025-12-01');


SHOW databases;
Use recua;
Show tables;
Show tables where usuarios;

