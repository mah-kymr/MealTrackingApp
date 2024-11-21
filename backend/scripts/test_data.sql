-- テストデータを挿入する前に既存データをクリア（必要に応じて実行）
TRUNCATE TABLE Meal_Records RESTART IDENTITY CASCADE;
TRUNCATE TABLE Meal_Categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE Users RESTART IDENTITY CASCADE;

-- Users テーブルにデータを挿入
INSERT INTO Users (username, password_hash, created_at) VALUES
('test_user1', 'hashed_password_1', NOW()),
('test_user2', 'hashed_password_2', NOW());

-- Meal_Categories テーブルにデータを挿入
INSERT INTO Meal_Categories (category_name) VALUES
('朝食'),
('昼食'),
('夕食'),
('間食');

-- Meal_Records テーブルにデータを挿入
INSERT INTO Meal_Records (user_id, category_id, start_time, end_time, duration_minutes, interval_minutes, created_at) VALUES
(1, 1, '2024-11-20 07:30:00', '2024-11-20 07:50:00', '00:20:00', NULL, NOW()),
(1, 2, '2024-11-20 12:15:00', '2024-11-20 12:40:00', '00:25:00', '04:25:00', NOW()),
(2, 3, '2024-11-20 19:00:00', '2024-11-20 19:45:00', '00:45:00', NULL, NOW());
