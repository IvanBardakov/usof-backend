# Usof Backend API

## 🚀 Short Description

This project is the backend API for **Usof**, a community-driven Question and Answer (Q&A) platform inspired by StackOverflow. It serves as the core server component, providing user authentication, post and comment management, and administrative functionality.

The API is built with **Node.js/Express** and uses **MySQL** as its relational database. The application follows the **Model-View-Controller (MVC)** architecture.

## 📖 Full Documentation

- [Overview & Architecture](docs/overview.md)
- [API Reference (Endpoints)](docs/endpoints.md)

---

### Core Functionality

- **Role-Based Access Control:** Supports `user` and `admin` roles. Admins have full CRUD access via a dedicated panel.
- **Authentication & Security:** Includes registration, login, password reset, and mandatory email verification (via Nodemailer). Passwords are securely hashed with `bcrypt`.
- **Content Management:** Provides full CRUD operations for Posts, Categories, Comments, and Likes. Allows locking posts/comments (active/inactive status).
- **File Uploads:** Supports user avatars and post images, stored locally under `/uploads/avatars` and `/uploads/posts`.
- **Data Sorting & Filtering:** Enables sorting posts by likes and publish date, with filtering by category, date range, status, user id.

### ✨ Creative Features

- **Favoriting Posts:** Users can add posts to their personal favorites list for quick access later.
- **Subscribing to Authors:** Users can subscribe to specific post and receive email notification when there is a new comment.
- **Marking Solutions:** Post authors can mark a specific comment as the accepted solution, highlighting it for others.

---

## 📸 Screenshots

| Interface                                                       | Description                                                                                    |
| :-------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **[Admin Panel](docs/images/adminjs.png)**                      | The AdminJS dashboard displaying models (Users, Posts, Categories, etc.) accessible to admins. |
| **[GET /api/posts](docs/images/getposts.png)**                  | Example API request showing a paginated list of posts.                                         |
| **[POST /api/auth/register](docs/images/userregistration.png)** | Example API response for registration or login.                                                |

---

## 🛠️ Requirements and Dependencies

### Prerequisites

Ensure the following are installed:

- **Node.js** v22.0+
- **MySQL Database Server** v8.0+

### Dependencies

Key packages used in this project:

| Dependency                                    | Purpose                               |
| :-------------------------------------------- | :------------------------------------ |
| `express`                                     | Web application framework             |
| `mysql2`                                      | MySQL client                          |
| `bcrypt`                                      | Password hashing                      |
| `express-session`                             | Session management                    |
| `adminjs`, `@adminjs/express`, `@adminjs/sql` | Admin panel framework and adapters    |
| `multer`                                      | File uploads                          |
| `nodemailer`                                  | Email verification and password reset |
| `dotenv`                                      | Environment variable management       |
| `express-validator`                           | Request validation                    |

---

## ⚙️ Running the Project

Follow these steps to run the API locally:

### 1. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd usof-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a **`.env`** file in the root directory with database, email server details, and DB creation options:

| Variable                       | Description                                    | Example                       |
| :----------------------------- | :--------------------------------------------- | :---------------------------- |
| `DB_ADMIN_USER`                | MySQL admin user                               | `admin`                       |
| `DB_ADMIN_PASSWORD`            | Admin user password                            | `admin_pass`                  |
| `DB_HOST`                      | Database host                                  | `localhost`                   |
| `DB_USER`                      | App database user                              | `ibardakov`                   |
| `DB_PASSWORD`                  | App database password                          | `$ecurasasda123ADSepa$$123!`  |
| `DB_NAME`                      | Database name                                  | `usof_db`                     |
| `DB_AUTO_CREATE`               | Automatically create database & user? (0 or 1) | `1`                           |
| `COOKIE_SECRET`                | Session/cookie secret                          | `your_cookie_secret`          |
| `PORT`                         | Server port                                    | `3000`                        |
| `SMTP_HOST`, `SMTP_PORT`, etc. | SMTP configuration for email                   | `smtp.gmail.com`, `465`, etc. |

> 💡 **Manual setup option:** If `DB_AUTO_CREATE=0`, you must create the database and user manually. You can use the SQL files in `/src/db`:
>
> - `create_db_manually.sql` → commands to create the database and tables
> - `create_user_manually.sql` → commands to create the app database user and grant privileges

---

### 4. Start the Application

The `server.js` script performs:

1. **Database Initialization (`initDb`)** – Ensures the `usof_db` database and app user exist.
   - If `DB_AUTO_CREATE=1`, the script attempts to create both database and user automatically. **Admin credentials are required** in this case.
   - If `DB_AUTO_CREATE=0`, the database and user must be created manually using the SQL files mentioned above. **Admin credentials are not needed** to start the app in this mode.

2. **Schema Setup (`setupDatabase`)** – Creates tables and relationships based on `schema.sql`.

#### Tip: Creating a MySQL admin user manually on Linux

If you don’t already have a MySQL admin user with password, you can create one:

```bash
sudo mysql
# Inside MySQL shell:
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'your_admin_password';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

- Replace `'your_admin_password'` with a secure password.
- This user can then be used in `.env` as `DB_ADMIN_USER` / `DB_ADMIN_PASSWORD` if auto creation is enabled.

Run the app:

```bash
npm start
```

### 5. Access the Interfaces

- **API Base URL:** `http://localhost:<PORT>/api`
- **Admin Panel:** `http://localhost:<PORT>/admin`

---

## API Testing with Postman

A Postman collection (`usof.postman_collection.json`) is included in this repository to help you test the API endpoints easily.

To use it:

1. Open [Postman](https://www.postman.com/).
2. Import the `usof.postman_collection.json` file.
3. Start testing the API endpoints right away.

Additionally, sample data for testing is provided in `src/db/test_data.sql`, which contains SQL inserts to populate the database for API tests.
