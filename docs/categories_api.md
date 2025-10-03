# 🏷️ Categories Endpoints

These endpoints manage the categories used for tagging posts.

---

## Get All Categories

**Endpoint:**
`GET /categories`

**Description:**
Retrieves a list of all existing categories.

**Access:**
**Public**

**Responses:**

- `200 OK`

  ```json
  [
    {
      "id": 1,
      "title": "Technology",
      "description": "Posts about software, hardware, and digital innovation.",
      "created_at": "2023-01-01T10:00:00.000Z",
      "updated_at": "2023-01-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Lifestyle",
      "description": "Health, travel, and daily living.",
      "created_at": "2023-01-05T12:30:00.000Z",
      "updated_at": "2023-01-05T12:30:00.000Z"
    }
  ]
  ```

---

## Get Category by ID

**Endpoint:**
`GET /categories/:category_id`

**Description:**
Retrieves details for a specific category by its ID.

**Access:**
**Public**

**Path Parameters:**

| Parameter     | Type      | Description             |
| :------------ | :-------- | :---------------------- |
| `category_id` | `integer` | The ID of the category. |

**Responses:**

- `200 OK`

  ```json
  {
    "id": 1,
    "title": "Technology",
    "description": "Posts about software, hardware, and digital innovation.",
    "created_at": "2023-01-01T10:00:00.000Z",
    "updated_at": "2023-01-01T10:00:00.000Z"
  }
  ```

- `404 Not Found`

  ```json
  { "error": "Category not found" }
  ```

---

## Get Posts for a Category

**Endpoint:**
`GET /categories/:category_id/posts`

**Description:**
Retrieves a list of all posts associated with the specified category ID.

**Access:**
**Public**

**Path Parameters:**

| Parameter     | Type      | Description             |
| :------------ | :-------- | :---------------------- |
| `category_id` | `integer` | The ID of the category. |

**Responses:**

- `200 OK`

  ```json
  [
    {
      "id": 101,
      "author_id": 5,
      "title": "AI in 2024",
      "content": "Full content...",
      "status": "active",
      "like_count": 52,
      "rating": 12,
      "publish_date": "2024-03-01T00:00:00.000Z",
      "created_at": "2024-03-01T00:00:00.000Z",
      "updated_at": "2024-03-01T00:00:00.000Z",
      "author_login": "tech_guru",
      "author_profile_picture": "/uploads/avatars/5.jpg"
    }
    // ... other post objects
  ]
  ```

- `404 Not Found` (If the category exists but has no associated posts, an empty array is returned).
  _Note: The current controller implementation does not explicitly check for category existence before checking for posts, so it will return an empty array if the category ID is invalid or has no posts._

---

## Create Category (Admin Only)

**Endpoint:**
`POST /categories`

**Description:**
Creates a new category.

**Required Role:**
`admin`

**Request Body:**

| Field         | Type     | Required | Description                          | Constraints            |
| :------------ | :------- | :------- | :----------------------------------- | :--------------------- |
| `title`       | `string` | Yes      | The title of the new category.       | 1–100 characters.      |
| `description` | `string` | No       | A brief description of the category. | Max 50,000 characters. |

```json
{
  "title": "Finance & Markets",
  "description": "News and analysis on global finance and trading."
}
```

**Responses:**

- `201 Created`

  ```json
  { "categoryId": 3 }
  ```

- `400 Bad Request` (Validation error)

  ```json
  {
    "errors": [
      {
        "msg": "Title is required and must be between 1 and 100 characters long",
        "param": "title",
        "location": "body"
      }
    ]
  }
  ```

- `403 Forbidden`

  ```json
  { "error": "Access denied. Admin required." }
  ```

---

## Update Category (Admin Only)

**Endpoint:**
`PATCH /categories/:category_id`

**Description:**
Updates the title or description of an existing category.

**Required Role:**
`admin`

**Path Parameters:**

| Parameter     | Type      | Description                       |
| :------------ | :-------- | :-------------------------------- |
| `category_id` | `integer` | The ID of the category to update. |

**Request Body:**
Can contain either `title` or `description` (or both).

```json
{
  "title": "Global Finance"
}
```

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `404 Not Found`

  ```json
  { "error": "Category not found or not updated" }
  ```

- `400 Bad Request` (Validation error)

  ```json
  { "errors": [{ "msg": "Title must be between 1 and 100 characters long", "param": "title", ... }] }
  ```

- `403 Forbidden`

  ```json
  { "error": "Access denied. Admin required." }
  ```

---

## Delete Category (Admin Only)

**Endpoint:**
`DELETE /categories/:category_id`

**Description:**
Deletes a category. _Note: The model handles deleting associated records in the `post_categories` pivot table._

**Required Role:**
`admin`

**Path Parameters:**

| Parameter     | Type      | Description                       |
| :------------ | :-------- | :-------------------------------- |
| `category_id` | `integer` | The ID of the category to delete. |

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `404 Not Found`

  ```json
  { "error": "Category not found or not deleted" }
  ```

- `403 Forbidden`

  ```json
  { "error": "Access denied. Admin required." }
  ```
