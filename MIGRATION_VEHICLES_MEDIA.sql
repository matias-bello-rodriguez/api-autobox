-- ============================================================
-- MIGRACIÓN: Actualizar tabla vehicles para múltiples medios
-- ============================================================
-- Fecha: 12 de noviembre de 2025
-- Descripción: Cambiar videoUrl (string) a videos (JSON array)
--              Permitir múltiples imágenes y videos (máximo 6 c/u)
-- ============================================================

USE autobox;

-- Verificar si existe la columna videoUrl
SET @dbname = DATABASE();
SET @tablename = 'vehicles';
SET @columnname = 'videoUrl';

-- Si existe videoUrl, crear columna videos y migrar datos
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND COLUMN_NAME = @columnname
  ) > 0,
  'ALTER TABLE vehicles ADD COLUMN videos JSON NULL AFTER images;',
  'SELECT ''Column videoUrl does not exist, skipping migration'' AS msg;'
));

PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Migrar datos existentes de videoUrl a videos (como array)
UPDATE vehicles 
SET videos = JSON_ARRAY(videoUrl)
WHERE videoUrl IS NOT NULL AND videoUrl != '';

-- Eliminar la columna videoUrl
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND COLUMN_NAME = @columnname
  ) > 0,
  'ALTER TABLE vehicles DROP COLUMN videoUrl;',
  'SELECT ''Column videoUrl already dropped'' AS msg;'
));

PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Verificar la estructura final
DESCRIBE vehicles;

-- ============================================================
-- NOTAS:
-- - images: JSON array, máximo 6 URLs
-- - videos: JSON array, máximo 6 URLs
-- - La validación de límites se realiza en el backend (DTO)
-- ============================================================
