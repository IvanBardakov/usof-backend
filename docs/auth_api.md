# 🔐 Auth Endpoints

Authentication is session-based. Successful login stores a `user` object in the session (`req.session.user`).

---

## Register

**Endpoint:**
`POST /auth/register`

**Description:**
Creates a new user account with login, email, password, and full name.

**Request Body:**

```json
{
  "login": "john_doe",
  "password": "StrongP@ssw0rd!",
  "password_confirmation": "StrongP@ssw0rd!",
  "email": "john@example.com",
  "full_name": "John Doe"
}
```

**Validation Rules:**

- `login`: 3–30 characters, only letters, numbers, or underscores.
- `password`: 8–100 characters, must contain uppercase, lowercase, number, and special character.
- `password_confirmation`: required, must match `password`.
- `email`: valid email format, max length 254.
- `full_name`: 1–100 characters.

**Responses:**

- `201 Created`

  ```json
  { "userId": 1 }
  ```

- `400 Bad Request`

  ```json
  { "error": "Login already exists" }
  ```

  or

  ```json
  { "error": "Email already exists" }
  ```

  or

  ```json
  { "error": "Password confirmation does not match password" }
  ```

  or validation errors:

  ```json
  {
    "errors": [
      { "msg": "Invalid email format", "param": "email", "location": "body" }
    ]
  }
  ```

---

## Login

**Endpoint:**
`POST /auth/login`

**Description:**
Logs in an existing user by validating credentials. Stores user session on success.

**Request Body:**

```json
{
  "login": "john_doe",
  "password": "StrongP@ssw0rd!"
}
```

**Validation Rules:**

- `login`: 3–30 characters, only letters, numbers, or underscores.
- `password`: 8–100 characters.

**Responses:**

- `200 OK`

  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "login": "john_doe",
      "role": "user",
      "email_confirmed": 0
    }
  }
  ```

- `400 Bad Request`

  ```json
  { "error": "Invalid login or password" }
  ```

---

## Logout

**Endpoint:**
`POST /auth/logout`

**Description:**
Destroys current session and logs out user.

**Responses:**

- `200 OK`

  ```json
  { "success": true, "message": "Logged out. Session destroyed." }
  ```

---

## Request Email Verification Link

**Endpoint:**
`POST /auth/email/send`

**Description:**
Sends an email with a unique verification token to the authenticated user's email address. Only works if the email is not already confirmed.

**Required Authentication:**
Must be logged in (session required).

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `400 Bad Request`

  ```json
  { "error": "Email already verified" }
  ```

- `404 Not Found` (If user ID from session is somehow invalid)

  ```json
  { "error": "User not found" }
  ```

- `500 Internal Server Error` (e.g., mailer service failure)

  ```json
  { "error": "Error sending verification email" }
  ```

---

## Verify Email

**Endpoint:**
`POST /auth/email/verify/:token`

**Description:**
Confirms the user's email address using the token received via email. Updates the user's `email_confirmed` status to `true` and updates the session.

**Path Parameters:**

| Parameter | Type     | Description                                   |
| :-------- | :------- | :-------------------------------------------- |
| `token`   | `string` | The unique verification token from the email. |

**Validation Rules:**

- `token`: required, must be a valid hex string (length 64).

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `400 Bad Request`

  ```json
  { "error": "Invalid or expired token" }
  ```

  or validation errors:

  ```json
  { "errors": [ { "msg": "Invalid verification token format", "param": "token", ... } ] }
  ```

- `500 Internal Server Error`

  ```json
  { "error": "Error confirming email" }
  ```

---

## Request Password Reset

**Endpoint:**
`POST /auth/password-reset`

**Description:**
Sends a password reset token to the email address provided.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Validation Rules:**

- `email`: valid email format.

**Responses:**

- `200 OK` (Always returns success even if email is not found to prevent user enumeration)

  ```json
  { "success": true }
  ```

- `404 Not Found` (Actual code in controller returns 404 if user not found, but it should probably return 200 for security reasons.)
  _Note: The current controller code will return `404 Not Found` if the user is not found._

  ```json
  { "error": "User not found" }
  ```

  or validation errors:

  ```json
  { "errors": [ { "msg": "Invalid email format", "param": "email", ... } ] }
  ```

---

## Confirm Password Reset

**Endpoint:**
`POST /auth/password-reset/:confirm_token`

**Description:**
Sets a new password for the user if the confirmation token is valid and not expired.

**Path Parameters:**

| Parameter       | Type     | Description                                     |
| :-------------- | :------- | :---------------------------------------------- |
| `confirm_token` | `string` | The unique password reset token from the email. |

**Request Body:**

```json
{
  "new_password": "NewStrongP@ssw0rd!"
}
```

**Validation Rules:**

- `confirm_token`: required, must be a valid hex string (length 64).
- `new_password`: 8–100 characters, must contain uppercase, lowercase, number, and special character.

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `400 Bad Request`

  ```json
  { "error": "Invalid or expired token" }
  ```

  or

  ```json
  {
    "error": "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character"
  }
  ```

  or validation errors:

  ```json
  { "errors": [ { "msg": "New password is required", "param": "new_password", ... } ] }
  ```

- `500 Internal Server Error`

  ```json
  { "error": "Error resetting password" }
  ```
