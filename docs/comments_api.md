Based on the provided code snippets for `CommentController.js`, `Comment.js` (Model), `comments.js` (Routes), and `commentValidation.js`, here are the API docs for the comments endpoints.

# 💬 Comments Endpoints

These endpoints manage comments on posts, including creation, retrieval, updating, deletion, liking, and marking as a solution.

---

## Get Comment by ID

**Endpoint:**
`GET /comments/:comment_id`

**Description:**
Retrieves a specific comment by its ID, along with the author's information.

**Access:**
**Public** (However, inactive comments are only visible to the author and admins).

**Path Parameters:**

| Parameter    | Type      | Description            |
| :----------- | :-------- | :--------------------- |
| `comment_id` | `integer` | The ID of the comment. |

**Responses:**

- `200 OK`

  ```json
  {
    "id": 12,
    "post_id": 5,
    "content": "This is a great point, thanks for sharing!",
    "publish_date": "2024-06-15T15:00:00.000Z",
    "status": "active",
    "updated_at": "2024-06-15T15:00:00.000Z",
    "author": {
      "id": 8,
      "login": "comment_user",
      "profile_picture": "/uploads/avatars/8.jpg"
    }
  }
  ```

- `404 Not Found`

  ```json
  { "error": "Comment not found" }
  ```

- `403 Forbidden` (If non-admin/non-author tries to view an inactive comment)

  ```json
  { "error": "Forbidden: cannot view inactive comment of another user" }
  ```

---

## Update Comment

**Endpoint:**
`PATCH /comments/:comment_id`

**Description:**
Updates the content or status of a comment.

**Access:**
**Authenticated**, **Verified**. Only the **author** of the comment or an **admin** can update it.

**Path Parameters:**

| Parameter    | Type      | Description                      |
| :----------- | :-------- | :------------------------------- |
| `comment_id` | `integer` | The ID of the comment to update. |

**Request Body:**

| Field     | Type     | Required | Description                      | Constraints                     |
| :-------- | :------- | :------- | :------------------------------- | :------------------------------ |
| `content` | `string` | No       | The new content for the comment. | 1–1000 characters.              |
| `status`  | `string` | No       | The new status of the comment.   | Must be `active` or `inactive`. |

```json
{
  "content": "I have updated my thought on this. Still a great post!"
}
```

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `400 Bad Request` (Validation error or no valid fields provided)

  ```json
  { "error": "No valid fields provided for update." }
  ```

- `403 Forbidden`

  ```json
  { "error": "Forbidden: can only update your own comment" }
  ```

- `404 Not Found`

  ```json
  { "error": "Comment not found" }
  ```

---

## Delete Comment

**Endpoint:**
`DELETE /comments/:comment_id`

**Description:**
Deletes a specific comment.

**Access:**
**Authenticated**, **Verified**. Only the **author** of the comment or an **admin** can delete it.

**Path Parameters:**

| Parameter    | Type      | Description                      |
| :----------- | :-------- | :------------------------------- |
| `comment_id` | `integer` | The ID of the comment to delete. |

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `403 Forbidden`

  ```json
  { "error": "Forbidden: can only delete your own comment" }
  ```

- `404 Not Found`

  ```json
  { "error": "Comment not found" }
  ```

---

## Like/Dislike Comment Endpoints

The following endpoints are delegated to the `LikeController`.

### Get Likes for Comment

**Endpoint:**
`GET /comments/:comment_id/like`

**Description:**
Retrieves the list of likes (and potentially dislikes/ratings, depending on `LikeController`'s implementation) associated with the comment.

**Access:**
**Public**

### Create Like on Comment

**Endpoint:**
`POST /comments/:comment_id/like`

**Description:**
Allows a verified user to like or rate a comment.

**Access:**
**Authenticated**, **Verified**

**Request Body:**
_Implies a body for rating/liking, typically `type: 1` for like, `type: -1` for dislike, etc., based on `likeCreateValidation`._

### Delete Like on Comment

**Endpoint:**
`DELETE /comments/:comment_id/like`

**Description:**
Removes the user's existing like/rating on the comment.

**Access:**
**Authenticated**, **Verified**

---

## Mark Comment as Solution

**Endpoint:**
`POST /comments/:comment_id/solution`

**Description:**
Marks a specific comment as the _solution_ for its parent post, typically used in Q\&A or forum posts. This updates the `solution_comment_id` field on the **Post** model.

**Access:**
**Authenticated**, **Verified**. Only the **author of the parent post** or an **admin** can perform this action.

**Path Parameters:**

| Parameter    | Type      | Description                                    |
| :----------- | :-------- | :--------------------------------------------- |
| `comment_id` | `integer` | The ID of the comment to mark as the solution. |

**Responses:**

- `200 OK`

  ```json
  { "success": true, "solution_comment_id": 45 }
  ```

- `403 Forbidden`

  ```json
  { "error": "Forbidden: only post author or admin can mark solution" }
  ```

- `404 Not Found`

  ```json
  { "error": "Comment not found" }
  ```

---

## Unmark Comment as Solution

**Endpoint:**
`DELETE /comments/:comment_id/solution`

**Description:**
Removes the solution designation from a comment on its parent post, by setting the post's `solution_comment_id` to `NULL`.

**Access:**
**Authenticated**, **Verified**. Only the **author of the parent post** or an **admin** can perform this action.

**Path Parameters:**

| Parameter    | Type      | Description                                      |
| :----------- | :-------- | :----------------------------------------------- |
| `comment_id` | `integer` | The ID of the comment to unmark as the solution. |

**Responses:**

- `200 OK`

  ```json
  { "success": true }
  ```

- `400 Bad Request` (If the comment is not currently the solution)

  ```json
  { "error": "This comment is not marked as solution" }
  ```

- `403 Forbidden`

  ```json
  { "error": "Forbidden: only post author or admin can unmark solution" }
  ```

- `404 Not Found`

  ```json
  { "error": "Comment not found" }
  ```
