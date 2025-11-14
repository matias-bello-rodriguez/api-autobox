-- ============================================================
-- MIGRACIÓN AUTOBOX - FASE 1 MVP
-- Mecánicos, Módulos y Sistema de Comisiones
-- ============================================================
-- Fecha: 11 de noviembre de 2025
-- Versión: 1.0
-- ============================================================

USE autobox;

-- ============================================================
-- TABLA: mechanics (Mecánicos)
-- ============================================================
CREATE TABLE IF NOT EXISTS mechanics (
    id VARCHAR(36) PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    rut VARCHAR(12) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    certifications JSON,
    backgroundCheck BOOLEAN DEFAULT FALSE,
    chipNumber VARCHAR(50),
    cameraNumber VARCHAR(50),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    totalInspections INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_rut (rut),
    INDEX idx_email (email),
    INDEX idx_active (isActive),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- TABLA: autobox_modules (Módulos AutoBox)
-- ============================================================
CREATE TABLE IF NOT EXISTS autobox_modules (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    cameraInfo JSON,
    networkInfo JSON,
    capacity INT DEFAULT 1,
    workingHours JSON,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_region (region),
    INDEX idx_active (isActive),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- TABLA: mechanic_modules (Relación Mecánico-Módulo)
-- ============================================================
CREATE TABLE IF NOT EXISTS mechanic_modules (
    id VARCHAR(36) PRIMARY KEY,
    mechanicId VARCHAR(36) NOT NULL,
    moduleId VARCHAR(36) NOT NULL,
    assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (mechanicId) REFERENCES mechanics(id) ON DELETE CASCADE,
    FOREIGN KEY (moduleId) REFERENCES autobox_modules(id) ON DELETE CASCADE,
    
    INDEX idx_mechanic (mechanicId),
    INDEX idx_module (moduleId),
    INDEX idx_active (isActive),
    
    UNIQUE KEY unique_mechanic_module (mechanicId, moduleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- TABLA: mechanic_earnings (Ganancias de Mecánicos)
-- ============================================================
CREATE TABLE IF NOT EXISTS mechanic_earnings (
    id VARCHAR(36) PRIMARY KEY,
    mechanicId VARCHAR(36) NOT NULL,
    inspectionId VARCHAR(255) NOT NULL,
    paymentId VARCHAR(36) NOT NULL,
    totalAmount DECIMAL(10, 2) NOT NULL,
    commissionRate DECIMAL(5, 2) NOT NULL,
    earnedAmount DECIMAL(10, 2) NOT NULL,
    platformFee DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    paidAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (mechanicId) REFERENCES mechanics(id) ON DELETE CASCADE,
    FOREIGN KEY (inspectionId) REFERENCES inspections(id) ON DELETE CASCADE,
    FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE,
    
    INDEX idx_mechanic (mechanicId),
    INDEX idx_inspection (inspectionId),
    INDEX idx_payment (paymentId),
    INDEX idx_status (status),
    INDEX idx_created (createdAt),
    
    CHECK (totalAmount >= 0),
    CHECK (commissionRate >= 0 AND commissionRate <= 100),
    CHECK (earnedAmount >= 0),
    CHECK (platformFee >= 0),
    CHECK (status IN ('pending', 'approved', 'paid', 'withdrawn'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- ACTUALIZAR TABLA: inspections
-- Agregar campos para mecánico, video y PDF
-- ============================================================

-- Agregar columnas una por una (si no existen)
SET @dbname = DATABASE();
SET @tablename = 'inspections';

-- mechanicId
SET @columnname = 'mechanicId';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT ''Column mechanicId already exists'' AS msg;',
  'ALTER TABLE inspections ADD COLUMN mechanicId VARCHAR(36) NULL AFTER userId;'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- videoUrl
SET @columnname = 'videoUrl';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT ''Column videoUrl already exists'' AS msg;',
  'ALTER TABLE inspections ADD COLUMN videoUrl VARCHAR(500) NULL AFTER price;'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- pdfReportUrl
SET @columnname = 'pdfReportUrl';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT ''Column pdfReportUrl already exists'' AS msg;',
  'ALTER TABLE inspections ADD COLUMN pdfReportUrl VARCHAR(500) NULL AFTER videoUrl;'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Agregar foreign key si no existe
SET @constraintname = 'fk_inspection_mechanic';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND CONSTRAINT_NAME = @constraintname
     AND CONSTRAINT_TYPE = 'FOREIGN KEY'
  ) > 0,
  'SELECT ''Foreign key fk_inspection_mechanic already exists'' AS msg;',
  'ALTER TABLE inspections ADD CONSTRAINT fk_inspection_mechanic FOREIGN KEY (mechanicId) REFERENCES mechanics(id) ON DELETE SET NULL;'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Crear índices si no existen
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND INDEX_NAME = 'idx_mechanic'
  ) > 0,
  'SELECT ''Index idx_mechanic already exists'' AS msg;',
  'CREATE INDEX idx_mechanic ON inspections(mechanicId);'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND INDEX_NAME = 'idx_status_date'
  ) > 0,
  'SELECT ''Index idx_status_date already exists'' AS msg;',
  'CREATE INDEX idx_status_date ON inspections(status, inspectionDate);'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista: Balance de mecánicos
CREATE OR REPLACE VIEW v_mechanic_balance AS
SELECT 
    m.id AS mechanicId,
    CONCAT(m.firstName, ' ', m.lastName) AS mechanicName,
    m.email,
    m.rating,
    m.totalInspections,
    COALESCE(SUM(CASE WHEN me.status = 'pending' THEN me.earnedAmount ELSE 0 END), 0) AS pendingBalance,
    COALESCE(SUM(CASE WHEN me.status = 'approved' THEN me.earnedAmount ELSE 0 END), 0) AS approvedBalance,
    COALESCE(SUM(CASE WHEN me.status = 'paid' THEN me.earnedAmount ELSE 0 END), 0) AS paidBalance,
    COALESCE(SUM(CASE WHEN me.status = 'withdrawn' THEN me.earnedAmount ELSE 0 END), 0) AS withdrawnBalance,
    COALESCE(SUM(me.earnedAmount), 0) AS totalEarnings,
    COUNT(DISTINCT me.inspectionId) AS totalPaidInspections
FROM mechanics m
LEFT JOIN mechanic_earnings me ON m.id = me.mechanicId
WHERE m.isActive = TRUE
GROUP BY m.id, m.firstName, m.lastName, m.email, m.rating, m.totalInspections;

-- Vista: Módulos con capacidad
CREATE OR REPLACE VIEW v_module_capacity AS
SELECT 
    am.id AS moduleId,
    am.name AS moduleName,
    am.address,
    am.region,
    am.capacity AS totalCapacity,
    COUNT(DISTINCT mm.mechanicId) AS assignedMechanics,
    am.isActive
FROM autobox_modules am
LEFT JOIN mechanic_modules mm ON am.id = mm.moduleId AND mm.isActive = TRUE
WHERE am.isActive = TRUE
GROUP BY am.id, am.name, am.address, am.region, am.capacity, am.isActive;

-- Vista: Inspecciones completas con mecánico
CREATE OR REPLACE VIEW v_inspections_with_mechanic AS
SELECT 
    i.*,
    v.plate AS vehiclePlate,
    v.brand AS vehicleBrand,
    v.model AS vehicleModel,
    CONCAT(u.firstName, ' ', u.lastName) AS clientName,
    u.email AS clientEmail,
    CONCAT(m.firstName, ' ', m.lastName) AS mechanicName,
    m.email AS mechanicEmail,
    m.rating AS mechanicRating
FROM inspections i
INNER JOIN vehicles v ON i.vehicleId = v.id
INNER JOIN users u ON i.userId = u.id
LEFT JOIN mechanics m ON i.mechanicId = m.id;

-- ============================================================
-- DATOS INICIALES (SEED)
-- ============================================================

-- Insertar módulos AutoBox de ejemplo
INSERT INTO autobox_modules (id, name, address, region, latitude, longitude, capacity, workingHours, isActive)
VALUES
    (UUID(), 'AutoBox Centro - Copec Centro', 'Av. Libertador Bernardo O\'Higgins 1234, Santiago Centro', 'Metropolitana', -33.4372, -70.6506, 10, 
     '{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "14:00"}}', 
     TRUE),
    (UUID(), 'AutoBox Providencia - Shell Providencia', 'Av. Providencia 2500, Providencia', 'Metropolitana', -33.4278, -70.6106, 12, 
     '{"monday": {"open": "08:00", "close": "19:00"}, "tuesday": {"open": "08:00", "close": "19:00"}, "wednesday": {"open": "08:00", "close": "19:00"}, "thursday": {"open": "08:00", "close": "19:00"}, "friday": {"open": "08:00", "close": "19:00"}, "saturday": {"open": "09:00", "close": "15:00"}}', 
     TRUE),
    (UUID(), 'AutoBox Las Condes - Petrobras Las Condes', 'Av. Apoquindo 4500, Las Condes', 'Metropolitana', -33.4091, -70.5731, 15, 
     '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "20:00"}, "saturday": {"open": "09:00", "close": "16:00"}}', 
     TRUE),
    (UUID(), 'AutoBox Maipú - Terpel Maipú', 'Av. Pajaritos 3000, Maipú', 'Metropolitana', -33.5088, -70.7624, 8, 
     '{"monday": {"open": "08:30", "close": "18:00"}, "tuesday": {"open": "08:30", "close": "18:00"}, "wednesday": {"open": "08:30", "close": "18:00"}, "thursday": {"open": "08:30", "close": "18:00"}, "friday": {"open": "08:30", "close": "18:00"}, "saturday": {"open": "09:00", "close": "13:00"}}', 
     TRUE),
    (UUID(), 'AutoBox La Florida - Copec La Florida', 'Av. Vicuña Mackenna 7800, La Florida', 'Metropolitana', -33.5253, -70.5879, 10, 
     '{"monday": {"open": "08:00", "close": "18:30"}, "tuesday": {"open": "08:00", "close": "18:30"}, "wednesday": {"open": "08:00", "close": "18:30"}, "thursday": {"open": "08:00", "close": "18:30"}, "friday": {"open": "08:00", "close": "18:30"}, "saturday": {"open": "09:00", "close": "14:00"}}', 
     TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- TRIGGERS AUTOMÁTICOS
-- ============================================================

-- Trigger: Crear ganancia automáticamente cuando el pago se completa
DELIMITER //
CREATE TRIGGER IF NOT EXISTS trg_create_mechanic_earning
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    DECLARE v_mechanicId VARCHAR(36);
    DECLARE v_totalAmount DECIMAL(10, 2);
    DECLARE v_commissionRate DECIMAL(5, 2);
    DECLARE v_earnedAmount DECIMAL(10, 2);
    DECLARE v_platformFee DECIMAL(10, 2);
    
    -- Solo crear ganancia si el pago se completó
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Obtener el mecánico asignado a la inspección
        SELECT mechanicId, price INTO v_mechanicId, v_totalAmount
        FROM inspections
        WHERE id = NEW.inspectionId;
        
        -- Si hay mecánico asignado
        IF v_mechanicId IS NOT NULL THEN
            SET v_commissionRate = 70.00;
            SET v_earnedAmount = (v_totalAmount * v_commissionRate) / 100;
            SET v_platformFee = v_totalAmount - v_earnedAmount;
            
            -- Insertar ganancia
            INSERT INTO mechanic_earnings (
                id, mechanicId, inspectionId, paymentId,
                totalAmount, commissionRate, earnedAmount, platformFee,
                status, createdAt
            ) VALUES (
                UUID(), v_mechanicId, NEW.inspectionId, NEW.id,
                v_totalAmount, v_commissionRate, v_earnedAmount, v_platformFee,
                'pending', NOW()
            );
        END IF;
    END IF;
END//
DELIMITER ;

-- ============================================================
-- VERIFICACIÓN DE MIGRACIÓN
-- ============================================================
SELECT 'Migración completada exitosamente' AS status;

SELECT 
    'mechanics' AS tabla,
    COUNT(*) AS registros
FROM mechanics
UNION ALL
SELECT 
    'autobox_modules' AS tabla,
    COUNT(*) AS registros
FROM autobox_modules
UNION ALL
SELECT 
    'mechanic_modules' AS tabla,
    COUNT(*) AS registros
FROM mechanic_modules
UNION ALL
SELECT 
    'mechanic_earnings' AS tabla,
    COUNT(*) AS registros
FROM mechanic_earnings;

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================
