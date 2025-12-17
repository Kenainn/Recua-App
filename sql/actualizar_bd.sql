-- Script para actualizar la base de datos con los campos faltantes

USE recua;

-- Agregar columnas descripcion y horario a la tabla materias si no existen
ALTER TABLE materias 
ADD COLUMN IF NOT EXISTS descripcion TEXT,
ADD COLUMN IF NOT EXISTS horario VARCHAR(100),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Agregar columna estado a la tabla tareas si no existe
ALTER TABLE tareas
ADD COLUMN IF NOT EXISTS estado ENUM('pendiente', 'completada') DEFAULT 'pendiente';

SELECT 'Base de datos actualizada correctamente' AS mensaje;
