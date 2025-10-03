# 👥 Users Endpoints

These endpoints manage user information.

---

## Get All Users

**Endpoint:**
`GET /users`

**Description:**
Retrieves a list of all users. Excludes sensitive data like `password` and `email`.

**Required Role:**
`admin`

**Responses:**

- `200 OK`

  ```json
  [
    {
      "id": 1,
      "login": "john_doe",
      "full_name": "John Doe",
      "profile_picture": "/uploads/avatars/avatar_1.jpg",
      "role": "admin",
      "created_at": "2023-01-01T10:00:00.000Z",
      "updated_at": "2023-01-01T10:00:00.000Z",
      "rating": 15
    },
    {
      "id": 2,
      "login": "jane_smith",
      "full_name": "Jane Smith",
      "profile_picture": null,
      "role": "user",
      "created_at": "2023-01-05T12:30:00.000Z",
      "updated_at": "2023-01-05T12:30:00.000Z",
      "rating": 5
    }
  ]
  ```

- `401 Unauthorized` (If not logged in)

  ```json
  { "error": "Not authenticated. Session required." }
  ```

- `403 Forbidden` (If logged in but not admin)

  ```json
  { "error": "Access denied. Admin required." }
  ```

---

## Get User by ID

**Endpoint:**
`GET /users/:user_id`

**Description:**
Retrieves a single user's details.

**Access:**
**Public** fields (excluding `password`, `email`, `email_confirmed`) are returned for all authenticated users viewing any profile.
**Admin** users get all fields except `password`.
**Self** (user requesting their own profile) gets all fields except `password`.

**Path Parameters:**

| Parameter | Type      | Description                     |
| :-------- | :-------- | :------------------------------ |
| `user_id` | `integer` | The ID of the user to retrieve. |

**Responses (Public/Default):**

- `200 OK` (For non-admin, non-self requests)

  ```json
  {
    "id": 2,
    "login": "jane_smith",
    "full_name": "Jane Smith",
    "profile_picture": null,
    "role": "user",
    "created_at": "2023-01-05T12:30:00.000Z",
    "updated_at": "2023-01-05T12:30:00.000Z",
    "rating": 5
  }
  ```

**Responses (Admin/Self):**

- `200 OK` (For admin or user requesting their own profile)

  ```json
  {
    "id": 1,
    "login": "john_doe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "profile_picture": "/uploads/avatars/avatar_1.jpg",
    "role": "admin",
    "email_confirmed": 1,
    "created_at": "2023-01-01T10:00:00.000Z",
    "updated_at": "2023-01-01T10:00:00.000Z",
    "rating": 15
  }
  ```

- `401 Unauthorized`

  ```json
  { "error": "Not authenticated. Session required." }
  ```

- `404 Not Found`

  ```json
  { "error": "User not found" }
  ```

---

## Create User (Admin Only)

**Endpoint:**
`POST /users`

**Description:**
Creates a new user account. This is an **admin-only** endpoint, typically used to manually create users or elevate privileges.

**Required Role:**
`admin`

**Request Body:**

```json
{
  "login": "new_user",
  "password": "StrongP@ssw0rd!",
  "email": "new.user@example.com",
  "full_name": "New User",
  "profile_picture": "/path/to/avatar.jpg",
  "role": "admin"
}
```

**Validation Rules:**
_(Assumes `userCreateValidation` applies the same rules as auth register, plus checks for existing login/email, and allows `role` to be set)_

- `login`: 3–30 characters, only letters, numbers, or underscores.
- `password`: 8–100 characters, must contain uppercase, lowercase, number, and special character.
- `email`: valid email format, max length 254.
- `full_name`: 1–100 characters.
- `role`: Optional, defaults to `'user'`. Must be a valid role (e.g., `'user'`, `'admin'`).
- `profile_picture`: Optional, path to avatar image.

**Responses:**

- `201 Created`

  ```json
  { "userId": 3 }
  ```

- `400 Bad Request`

  ```json
  { "error": "Login already exists" }
  ```

  or validation errors (from `validate` middleware):

  ```json
  {
    "errors": [
      { "msg": "Invalid email format", "param": "email", "location": "body" }
    ]
  }
  ```

- `403 Forbidden`

  ```json
  { "error": "Access denied. Admin required." }
  ```

---

## Update User (Admin Only)

**Endpoint:**
`PATCH /users/:user_id`

**Description:**
Updates a user's details. This route is set to be **admin-only** in the provided router setup (`roleMiddleware('admin')`). _Note: The accompanying code would likely need to be modified for a user to update their own profile without being an admin._

**Required Role:**
`admin`

**Path Parameters:**

| Parameter | Type      | Description                   |
| :-------- | :-------- | :---------------------------- |
| `user_id` | `integer` | The ID of the user to update. |

**Request Body:**
Can contain any field that needs updating (`login`, `email`, `full_name`, `password`, `role`, etc.).

```json
{
  "full_name": "John A. Doe",
  "role": "user"
}
```

**Validation Rules:**
Applicable rules for all fields that are present in the request body (handled by `userUpdateValidation` and `validate`).

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `404 Not Found`

  ```json
  { "error": "User not found or not updated" }
  ```

- `400 Bad Request`

  ```json
  { "error": "Email already in use" }
  ```

  or validation errors:

  ```json
  { "errors": [ { "msg": "Invalid email format", "param": "email", ... } ] }
  ```

- `403 Forbidden`

  ```json
  { "error": "Access denied. Admin required." }
  ```

---

## Delete User

**Endpoint:**
`DELETE /users/:user_id`

**Description:**
Deletes a user account. Requires the current user to be **verified** (`email_confirmed = 1`).

**Access:**
**Admin** can delete any user. **Self** (user deleting their own profile).

**Path Parameters:**

| Parameter | Type      | Description                   |
| :-------- | :-------- | :---------------------------- |
| `user_id` | `integer` | The ID of the user to delete. |

**Required Middleware:**
`verifiedMiddleware` (User must have `email_confirmed = 1`)

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `404 Not Found`

  ```json
  { "error": "User not found or not deleted" }
  ```

- `403 Forbidden` (If not verified)

  ```json
  { "error": "User must be verified to perform this action" }
  ```

---

## Upload Avatar

**Endpoint:**
`PATCH /users/avatar`

**Description:**
Uploads and sets a new profile picture (avatar) for the **authenticated user**. Overwrites and deletes the previous avatar file if one existed. Requires the user to be **verified**.

**Request:**
A `multipart/form-data` request containing a file field named `avatar`.

**Required Middleware:**
`verifiedMiddleware` (User must have `email_confirmed = 1`)

**Responses:**

- `200 OK`

  ```json
  {
    "success": true,
    "avatar": "/uploads/avatars/new_avatar_2.jpg"
  }
  ```

- `400 Bad Request`

  ```json
  { "error": "No file uploaded" }
  ```

  or (from `multerErrorHandler`)

  ```json
  { "error": "File too large" }
  ```

  or

  ```json
  { "error": "Only one avatar image can be uploaded at a time." }
  ```

- `403 Forbidden`

  ```json
  { "error": "User must be verified to perform this action" }
  ```

- `500 Internal Server Error` (e.g., file system error)

  ```json
  { "error": "Error during avatar upload or update" }
  ```
