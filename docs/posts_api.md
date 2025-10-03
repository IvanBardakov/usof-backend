# 📝 Posts Endpoints

## Get All Posts

**Endpoint:**
`GET /posts`

**Description:**
Retrieves a list of posts with filtering, sorting, and pagination.

**Access:**
**Public** (Only 'active' posts are visible to unauthenticated users). Authenticated users can see their own 'draft' or 'inactive' posts. Admins can see all statuses.

**Query Parameters:**

| Parameter   | Type      | Default                 | Description                                                                                                                |
| :---------- | :-------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `page`      | `integer` | `1`                     | Page number for pagination.                                                                                                |
| `limit`     | `integer` | `10`                    | Number of posts per page.                                                                                                  |
| `sort`      | `string`  | `publish_date`          | Field to sort by: `publish_date`, `rating`, or `likes`.                                                                    |
| `order`     | `string`  | `desc`                  | Sort order: `asc` or `desc`.                                                                                               |
| `category`  | `integer` | `null`                  | Filter by category ID.                                                                                                     |
| `author_id` | `integer` | `null`                  | Filter by user (author) ID.                                                                                                |
| `status`    | `string`  | `'active'` (for public) | Filter by post status: `active`, `draft`, `inactive`. Only applicable for admin or when filtering by **self** `author_id`. |
| `date_from` | `string`  | `null`                  | Filter posts published after this date (YYYY-MM-DD).                                                                       |
| `date_to`   | `string`  | `null`                  | Filter posts published before this date (YYYY-MM-DD).                                                                      |

**Responses:**

- `200 OK`

  ```json
  {
    "posts": [
      {
        "id": 101,
        "title": "My First Post",
        "content": "Content excerpt...",
        "status": "active",
        "like_count": 52,
        "rating": 12,
        "publish_date": "2023-10-20T14:00:00.000Z",
        "created_at": "2023-10-20T14:00:00.000Z",
        "updated_at": "2023-10-20T14:00:00.000Z",
        "author": {
          "id": 1,
          "login": "john_doe",
          "profile_picture": "/uploads/avatars/avatar_1.jpg"
        },
        "categories": [
          { "id": 1, "name": "Technology" },
          { "id": 5, "name": "Programming" }
        ],
        "isFavorited": true,
        "isSubscribed": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPosts": 25,
      "totalPages": 3
    }
  }
  ```

- `400 Bad Request` (Validation error from `postQueryValidation`)

  ```json
  { "errors": [{ "msg": "Invalid sort parameter", "param": "sort", ... }] }
  ```

---

## Get Post by ID

**Endpoint:**
`GET /posts/:post_id`

**Description:**
Retrieves a single post's details.

**Access:**
**Public** for 'active' posts. Author or Admin can view any post status (`active`, `draft`, `inactive`).

**Path Parameters:**

| Parameter | Type      | Description         |
| :-------- | :-------- | :------------------ |
| `post_id` | `integer` | The ID of the post. |

**Responses:**

- `200 OK`

  ```json
  {
    "id": 101,
    "title": "My First Post",
    "content": "Full post content...",
    "status": "active",
    "like_count": 52,
    "rating": 12,
    "publish_date": "2023-10-20T14:00:00.000Z",
    "created_at": "2023-10-20T14:00:00.000Z",
    "updated_at": "2023-10-20T14:00:00.000Z",
    "author": {
      "id": 1,
      "login": "john_doe",
      "profile_picture": "/uploads/avatars/avatar_1.jpg"
    },
    "isFavorited": true,
    "isSubscribed": false
  }
  ```

- `404 Not Found`

  ```json
  { "error": "Post not found" }
  ```

- `403 Forbidden` (If trying to view a non-active post without being the author or an admin)

  ```json
  { "error": "Forbidden: cannot view inactive post of another user" }
  ```

---

## Create Post

**Endpoint:**
`POST /posts`

**Description:**
Creates a new post. The initial status will be `'active'` by default (based on `Post.js` model).

**Access:**
**Authenticated** and **Verified** users only.

**Request Body:**

| Field        | Type             | Required | Description                                                              |
| :----------- | :--------------- | :------- | :----------------------------------------------------------------------- |
| `title`      | `string`         | Yes      | The title of the post (min 1 character).                                 |
| `content`    | `string`         | Yes      | The full content of the post.                                            |
| `categories` | `array<integer>` | Yes      | A list of category IDs to tag the post with (must contain at least one). |

```json
{
  "title": "New Tech Trend Report",
  "content": "A detailed look at the latest tech trends...",
  "categories": [1, 3]
}
```

**Responses:**

- `201 Created`

  ```json
  { "postId": 102 }
  ```

- `400 Bad Request`

  ```json
  { "error": "One or more categories do not exist" }
  ```

  or

  ```json
  { "errors": [{ "msg": "Title is required", "param": "title", ... }] }
  ```

- `403 Forbidden` (If not verified)

  ```json
  { "error": "User must be verified to perform this action" }
  ```

---

## Update Post

**Endpoint:**
`PATCH /posts/:post_id`

**Description:**
Updates an existing post.

**Access:**
**Authenticated** and **Verified**. Only the **Post Author** or an **Admin** can update a post (controlled by `postUpdatePermissionMiddleware`).

| User Role  | Allowed Fields to Update                   |
| :--------- | :----------------------------------------- |
| **Author** | `title`, `content`, `categories`           |
| **Admin**  | `title`, `content`, `categories`, `status` |

**Path Parameters:**

| Parameter | Type      | Description                   |
| :-------- | :-------- | :---------------------------- |
| `post_id` | `integer` | The ID of the post to update. |

**Request Body (Example for Author):**

```json
{
  "title": "Updated Title",
  "categories": [1]
}
```

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `404 Not Found`

  ```json
  { "error": "Post not found" }
  ```

- `403 Forbidden` (If not author/admin, or not verified)

  ```json
  { "error": "Forbidden: you do not have permission to update this post" }
  ```

- `400 Bad Request`

  ```json
  { "error": "No valid fields to update" }
  ```

---

## Delete Post

**Endpoint:**
`DELETE /posts/:post_id`

**Description:**
Deletes a post.

**Access:**
**Authenticated** and **Verified**. Only the **Post Author** or an **Admin** can delete a post.

**Path Parameters:**

| Parameter | Type      | Description                   |
| :-------- | :-------- | :---------------------------- |
| `post_id` | `integer` | The ID of the post to delete. |

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `404 Not Found`

  ```json
  { "error": "Post not found" }
  ```

- `403 Forbidden` (If not author/admin, or not verified)

  ```json
  { "error": "Forbidden: can only delete your own post" }
  ```

---

---

# 🔗 Post Interactions

## Add/Remove Post to Favorites

**Endpoints:**

- **Add:** `POST /posts/:post_id/favorite`
- **Remove:** `DELETE /posts/:post_id/favorite`

**Description:**
Allows a user to add a post to their favorites list. Only **active** posts can be favorited.

**Access:**
**Authenticated** and **Verified** users only.

**Path Parameters:**

| Parameter | Type      | Description         |
| :-------- | :-------- | :------------------ |
| `post_id` | `integer` | The ID of the post. |

**Responses (POST/DELETE):**

- `200 OK`

  ```json
  { "success": true }
  ```

- `404 Not Found`

  ```json
  { "error": "Post not found" }
  ```

- `400 Bad Request` (For POST only)

  ```json
  { "error": "Cannot favorite an inactive post" }
  ```

## Get User Favorite Posts

**Endpoint:**
`GET /posts/favorites`

**Description:**
Retrieves all **active** posts favorited by the authenticated user.

**Access:**
**Authenticated** and **Verified** users only.

**Responses:**

- `200 OK`

  ```json
  {
    "posts": [
      /* Post objects with full details, only active ones */
    ],
    "count": 5
  }
  ```

---

## Subscribe/Unsubscribe to Post

**Endpoints:**

- **Subscribe:** `POST /posts/:post_id/subscribe`
- **Unsubscribe:** `DELETE /posts/:post_id/subscribe`

**Description:**
Allows a user to subscribe to a post, typically to receive notifications for new comments.

**Access:**
**Authenticated** and **Verified** users only.

**Path Parameters:**

| Parameter | Type      | Description         |
| :-------- | :-------- | :------------------ |
| `post_id` | `integer` | The ID of the post. |

**Responses (POST/DELETE):**

- `200 OK`

  ```json
  { "success": true }
  ```

- `404 Not Found`

  ```json
  { "error": "Post not found" }
  ```

## Get User Subscribed Posts

**Endpoint:**
`GET /posts/subscriptions`

**Description:**
Retrieves a list of all **active** posts the authenticated user is currently subscribed to.

**Access:**
**Authenticated** users only.

**Responses:**

- `200 OK`

  ```json
  {
    "posts": [
      /* Post objects with full details, only active ones */
    ],
    "count": 3
  }
  ```

---

## Create Comment or Reply

**Endpoint:**
`POST /posts/:post_id/comments`

**Description:**
Adds a new comment to a post. Optionally, a comment can be a **reply** to another comment by specifying `parent_id`.

**Access:**
**Authenticated** and **Verified** users only.

**Path Parameters:**

| Parameter | Type    | Description                       |
| :-------- | :------ | :-------------------------------- |
| `post_id` | integer | The ID of the post to comment on. |

**Request Body:**

| Field       | Type    | Required | Description                                                               |
| :---------- | :------ | :------- | :------------------------------------------------------------------------ |
| `content`   | string  | Yes      | The text content of the comment.                                          |
| `parent_id` | integer | No       | ID of the parent comment. Must belong to the same post and be **active**. |

**Validation Rules:**

1. `content` is required (1–1000 characters).
2. `parent_id` (if provided):
   - Must exist.
   - Must belong to the same post.
   - Must be **active** and not deleted. Replies to inactive or deleted comments are forbidden.

**Responses:**

- `201 Created`

```json
{
  "id": 100,
  "post_id": 5,
  "parent_id": 12,
  "content": "I agree with your point!",
  "publish_date": "2025-10-01T12:00:00.000Z",
  "status": "active",
  "deleted": false,
  "updated_at": "2025-10-01T12:00:00.000Z",
  "author": {
    "id": 9,
    "login": "new_user",
    "profile_picture": "/uploads/avatars/default.png"
  }
}
```

- `400 Bad Request`

```json
{ "error": "Cannot reply to inactive or deleted comment" }
```

- `404 Not Found`

```json
{ "error": "Parent comment not found" }
```

---

## Get Post Comments

**Endpoint:**
`GET /posts/:post_id/comments`

**Description:**
Retrieves all comments for a specific post. Replies are included with their `parent_id` to maintain hierarchy. Deleted comments return only `id`, `content`, `deleted: true`, `author`, and `parent_id`.

**Access:**
**Public**. Inactive comments are only visible to the author or admins.

**Path Parameters:**

| Parameter | Type    | Description         |
| :-------- | :------ | :------------------ |
| `post_id` | integer | The ID of the post. |

**Responses:**

- `200 OK`

```json
[
  {
    "id": 12,
    "post_id": 5,
    "parent_id": null,
    "content": "This is a top-level comment.",
    "publish_date": "2025-10-01T12:00:00.000Z",
    "status": "active",
    "deleted": false,
    "updated_at": "2025-10-01T12:00:00.000Z",
    "author": {
      "id": 2,
      "login": "bob_regular",
      "profile_picture": "/uploads/avatars/default.png"
    }
  },
  {
    "id": 13,
    "post_id": 5,
    "parent_id": 12,
    "content": "This is a reply.",
    "publish_date": "2025-10-01T12:05:00.000Z",
    "status": "active",
    "deleted": false,
    "updated_at": "2025-10-01T12:05:00.000Z",
    "author": {
      "id": 3,
      "login": "alice",
      "profile_picture": "/uploads/avatars/default.png"
    }
  },
  {
    "id": 14,
    "post_id": 5,
    "parent_id": 12,
    "content": "[deleted]",
    "deleted": true,
    "author": {
      "id": 4,
      "login": "charlie",
      "profile_picture": "/uploads/avatars/default.png"
    }
  }
]
```

## Get Post Categories

**Endpoint:**
`GET /posts/:post_id/categories`

**Description:**
Retrieves a list of categories associated with a post.

**Access:**
**Public**.

**Path Parameters:**

| Parameter | Type      | Description         |
| :-------- | :-------- | :------------------ |
| `post_id` | `integer` | The ID of the post. |

**Responses:**

- `200 OK`

  ```json
  [
    { "id": 1, "name": "Technology", "slug": "technology" },
    { "id": 3, "name": "Gaming", "slug": "gaming" }
  ]
  ```

---

## Like/Dislike Post

**Endpoints:**

- **Get Likes:** `GET /posts/:post_id/like`
- **Create/Update Like:** `POST /posts/:post_id/like`
- **Delete Like:** `DELETE /posts/:post_id/like`

**Description:**
Allows users to like or dislike a post, or to retrieve the current like/dislike status.

**Access (Create/Delete):**
**Authenticated** and **Verified** users only.

**Path Parameters:**

| Parameter | Type      | Description         |
| :-------- | :-------- | :------------------ |
| `post_id` | `integer` | The ID of the post. |

**Request Body (POST):**

| Field  | Type     | Required | Description                                    |
| :----- | :------- | :------- | :--------------------------------------------- |
| `type` | `string` | Yes      | The type of reaction: `'like'` or `'dislike'`. |

```json
{
  "type": "like"
}
```

**Responses (GET):**

- `200 OK`

  ```json
  {
    "post_id": 101,
    "likes_count": 52,
    "dislikes_count": 10,
    "user_reaction": "like" // or "dislike" or null
  }
  ```

**Responses (POST/DELETE):**

- `200 OK`

  ```json
  { "success": true }
  ```

- `400 Bad Request` (Validation error for POST)

  ```json
  { "errors": [{ "msg": "Invalid like type", "param": "type", ... }] }
  ```

---

## Upload Post Image

**Endpoint:**
`POST /posts/images`

**Description:**
Uploads an image file for use within a post's content. Returns the URL of the uploaded image. _Note: The file is renamed to include the `post_id` and a unique identifier._

**Access:**
**Authenticated** and **Verified** users only.

**Request:**
A `multipart/form-data` request.

| Field     | Type      | Required | Description                               |
| :-------- | :-------- | :------- | :---------------------------------------- |
| `image`   | `file`    | Yes      | The image file to upload.                 |
| `post_id` | `integer` | Yes      | The ID of the post this image belongs to. |

**Responses:**

- `201 Created`

  ```json
  {
    "url": "/uploads/posts/102-1688998800000-123456789.jpg"
  }
  ```

- `400 Bad Request`

  ```json
  { "error": "Maximum 10 images per post allowed" }
  ```

  or

  ```json
  { "error": "No file uploaded" }
  ```

  or

  ```json
  { "error": "post_id is required" }
  ```
