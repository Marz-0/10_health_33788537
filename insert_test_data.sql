-- Insert test data for Health app

USE health;

-- Sample workout data
INSERT INTO workouts (title, activity_type, duration_minutes, intensity, notes, performed_at) VALUES
('Morning Run', 'Running', 30, 'medium', 'Easy-paced jog around the park', '2025-01-10'),
('Strength Session', 'Strength Training', 45, 'high', 'Leg and core exercises', '2025-01-12'),
('Yoga Stretch', 'Yoga', 20, 'low', 'Relaxing flexibility session', '2025-01-15');

-- Sample user data
INSERT INTO users (username, first, last, email, hashedPassword)
VALUES ('gold', 'Marking', 'User', 'gold@example.com', '<HASHED_PASSWORD_HERE>');

