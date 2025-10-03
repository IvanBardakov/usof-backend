USE usof_db;

-- USERS
INSERT INTO users (id, login, password, full_name, email, profile_picture, rating, role, email_confirmed)
VALUES
(1, 'alice', 'hashed_pw1', 'Alice Johnson', 'alice@example.com', "/uploads/avatars/default.png", 4, 'user', 1),
(2, 'bob', 'hashed_pw2', 'Bob Smith', 'bob@example.com', "/uploads/avatars/default.png", -1, 'user', 1),
(3, 'charlie', 'hashed_pw3', 'Charlie Brown', 'charlie@example.com', "/uploads/avatars/default.png", 2, 'user', 0),
(4, 'diana', 'hashed_pw4', 'Diana Prince', 'diana@example.com', "/uploads/avatars/default.png", 1, 'admin', 1),
(5, 'eve', 'hashed_pw5', 'Eve Adams', 'eve@example.com', "/uploads/avatars/default.png", -2, 'user', 1);

-- CATEGORIES
INSERT INTO categories (id, title, description)
VALUES
(1, 'Programming', 'All about coding and development'),
(2, 'Databases', 'Database design, SQL, and optimization'),
(3, 'Security', 'Cybersecurity, best practices, exploits'),
(4, 'AI/ML', 'Artificial Intelligence and Machine Learning'),
(5, 'DevOps', 'CI/CD, infrastructure, and automation');

-- POSTS
INSERT INTO posts (id, author_id, title, content, like_count, status)
VALUES
(1, 1, 'How to optimize SQL queries?', 'Looking for tips to speed up my queries...', 3, 'active'),
(2, 2, 'Best practices for password hashing', 'Should I use bcrypt or argon2?', -1, 'active'),
(3, 3, 'Beginner guide to machine learning', 'Where should I start learning ML?', 2, 'active'),
(4, 4, 'Docker vs Podman', 'Which container runtime should I use?', 1, 'active'),
(5, 5, 'Preventing SQL injection', 'How to properly sanitize inputs?', -2, 'active');

-- POST-CATEGORIES
INSERT INTO post_categories (post_id, category_id)
VALUES
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 2);

-- COMMENTS
INSERT INTO comments (id, post_id, author_id, parent_id, content, status)
VALUES
(1, 1, 2, NULL, 'Use EXPLAIN to analyze queries', 'active'),
(2, 1, 3, 1, 'Good suggestion!', 'active'),
(3, 2, 1, NULL, 'Argon2 is more secure', 'active'),
(4, 3, 5, NULL, 'Start with linear regression basics', 'active'),
(5, 5, 4, NULL, 'Always use prepared statements', 'active');

-- LIKES (post reactions + comment reactions)
INSERT INTO likes (id, author_id, post_id, comment_id, type)
VALUES
-- Likes for posts
(1, 2, 1, NULL, 'like'),
(2, 3, 1, NULL, 'like'),
(3, 4, 1, NULL, 'like'),
(4, 1, 2, NULL, 'dislike'),
(5, 5, 2, NULL, 'dislike'),
(6, 1, 3, NULL, 'like'),
(7, 2, 3, NULL, 'like'),
(8, 3, 4, NULL, 'like'),
(9, 1, 5, NULL, 'dislike'),
(10, 2, 5, NULL, 'dislike'),

-- Likes for comments
(11, 1, NULL, 1, 'like'),
(12, 3, NULL, 1, 'like'),
(13, 4, NULL, 2, 'dislike'),
(14, 5, NULL, 3, 'like'),
(15, 2, NULL, 4, 'like');

-- FAVORITES
INSERT INTO favorites (id, user_id, post_id)
VALUES
(1, 1, 3),
(2, 2, 1),
(3, 3, 2),
(4, 4, 5),
(5, 5, 4);

-- SUBSCRIPTIONS
INSERT INTO post_subscriptions (id, user_id, post_id)
VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5);

-- EMAIL VERIFICATION TOKENS
INSERT INTO email_verification_tokens (id, user_id, token, expires_at, used)
VALUES
(1, 1, 'token1', '2025-12-31 23:59:59', 1),
(2, 2, 'token2', '2025-12-31 23:59:59', 1),
(3, 3, 'token3', '2025-12-31 23:59:59', 0),
(4, 4, 'token4', '2025-12-31 23:59:59', 1),
(5, 5, 'token5', '2025-12-31 23:59:59', 1);

-- PASSWORD RESET TOKENS
INSERT INTO password_reset_tokens (id, user_id, token, expires_at, used)
VALUES
(1, 1, 'reset1', '2025-12-31 23:59:59', 0),
(2, 2, 'reset2', '2025-12-31 23:59:59', 1),
(3, 3, 'reset3', '2025-12-31 23:59:59', 0),
(4, 4, 'reset4', '2025-12-31 23:59:59', 1),
(5, 5, 'reset5', '2025-12-31 23:59:59', 0);
