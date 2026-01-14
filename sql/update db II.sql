USE recua;

-- Si alguna columna ya existe, el script fallará.
-- Si quieres ir a lo seguro, agrégalas una por una:
ALTER TABLE usuarios
ADD COLUMN exp INT DEFAULT 0,
ADD COLUMN nivel INT DEFAULT 1,
ADD COLUMN racha_actual INT DEFAULT 0,
ADD COLUMN mejor_racha INT DEFAULT 0,
ADD COLUMN ultima_tarea_fecha DATE NULL;
