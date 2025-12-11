-- Create database script for Health app

-- Create the database
CREATE DATABASE IF NOT EXISTS health;
USE health;

-- Main data table (example: fitness tracking - workouts)
CREATE TABLE IF NOT EXISTS workouts (
    id INT AUTO_INCREMENT,
    title VARCHAR(100),              -- e.g. "Morning Run", "Leg Day"
    activity_type VARCHAR(50),       -- e.g. "Running", "Strength", "Yoga"
    duration_minutes INT,            -- e.g. 30
    intensity VARCHAR(20),           -- e.g. "low", "medium", "high"
    notes TEXT,                      -- extra info
    performed_at DATE,               -- when the workout happened
    PRIMARY KEY (id)
);

-- Users table (for registrations / logins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    username VARCHAR(100),
    first VARCHAR(50),
    last VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(255),
    hashedPassword VARCHAR(255),
    PRIMARY KEY (id)
);

-- Login audit table to track successful and failed logins
CREATE TABLE IF NOT EXISTS login_audit (
    id INT AUTO_INCREMENT,
    identifier VARCHAR(100) NOT NULL,       -- username or email used to log in
    success TINYINT(1) NOT NULL,            -- 1 for success, 0 for failure
    reason VARCHAR(255),                    -- e.g. "invalid password"
    ip VARCHAR(45),                         -- IP address
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Create the application user 
CREATE USER IF NOT EXISTS 'health_app'@'localhost'
IDENTIFIED WITH caching_sha2_password BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';


-- Flush privileges to ensure that all changes made so far are applied
FLUSH PRIVILEGES;



