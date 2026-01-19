-- Agrega las columnas para la dificultad y recompensa de XP en la tabla 'tareas'
ALTER TABLE tareas ADD COLUMN dificultad ENUM('facil', 'medio', 'dificil') DEFAULT 'medio';
ALTER TABLE tareas ADD COLUMN xp_reward INT DEFAULT 50;

-- Agrega la columna 'profesor' (texto) en la tabla 'materias' para permitir nombres personalizados o sin relación estricta
ALTER TABLE materias ADD COLUMN profesor VARCHAR(255);
