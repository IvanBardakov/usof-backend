-- src/db/create_user_manually.sql

-- Create the user
CREATE USER 'usof_user'@'%' IDENTIFIED BY 'your_password_here';

-- Grant privileges on the database
GRANT ALL PRIVILEGES ON usof_db.* TO 'usof_user'@'%';

-- Apply changes
FLUSH PRIVILEGES;