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

-- Sample achievements data
INSERT INTO achievements (title, description, category, metric_value, metric_unit, achieved_at, created_by) VALUES
('5K personal best', 'Beat my previous time on the park loop', 'Endurance', 27, 'minutes', '2025-02-01', 'gold'),
('Bench press milestone', 'Reached a new 1RM', 'Strength', 80, 'kg', '2025-02-05', 'gold'),
('Weekly streak', 'Trained 5 days in a row', 'Consistency', 5, 'days', '2025-02-09', 'gold');

