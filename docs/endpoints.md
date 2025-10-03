# 🗺️ API Endpoints Overview

This document provides a central directory for all available API endpoints, categorized by their resource.

| Resource           | Base Path         | Documentation                         |
| :----------------- | :---------------- | :------------------------------------ |
| **Authentication** | `/api/auth`       | [Authentication API](./auth_api.md)   |
| **Users**          | `/api/users`      | [Users API](./users_api.md)           |
| **Posts**          | `/api/posts`      | [Posts API](./posts_api.md)           |
| **Categories**     | `/api/categories` | [Categories API](./categories_api.md) |
| **Comments**       | `/api/comments`   | [Comments API](./comments_api.md)     |

---

## 🔗 Direct Endpoint Links

### Authentication (`/api/auth`)

- [POST /api/auth/register](./auth_api.md#user-registration)
- [POST /api/auth/login](./auth_api.md#user-login)
- [POST /api/auth/logout](./auth_api.md#user-logout)
- [POST /api/auth/verify](./auth_api.md#verify-email)
- [POST /api/auth/resend-verification](./auth_api.md#resend-verification-email)
- [POST /api/auth/forgot-password](./auth_api.md#forgot-password)
- [POST /api/auth/reset-password](./auth_api.md#reset-password)
- [GET /api/auth/me](./auth_api.md#get-current-user-session-data)

### Users (`/api/users`)

- [GET /api/users](./users_api.md#get-all-users-admin-only)
- [GET /api/users/:user_id](./users_api.md#get-user-by-id)
- [PATCH /api/users/:user_id](./users_api.md#update-user-profile)
- [PATCH /api/users/:user_id/password](./users_api.md#change-user-password)
- [DELETE /api/users/:user_id](./users_api.md#delete-user-account)
- [POST /api/users/:user_id/subscribe](./users_api.md#subscribe-to-user-posts)
- [DELETE /api/users/:user_id/subscribe](./users_api.md#unsubscribe-from-user-posts)
- [GET /api/users/:user_id/subscriptions](./users_api.md#get-user-subscriptions)

### Posts (`/api/posts`)

- [GET /api/posts](./posts_api.md#get-all-posts-public-and-filtered)
- [POST /api/posts](./posts_api.md#create-new-post)
- [GET /api/posts/feed](./posts_api.md#get-personalized-feed)
- [GET /api/posts/my](./posts_api.md#get-my-posts)
- [GET /api/posts/:post_id](./posts_api.md#get-post-by-id)
- [PATCH /api/posts/:post_id](./posts_api.md#update-post)
- [DELETE /api/posts/:post_id](./posts_api.md#delete-post)
- [GET /api/posts/:post_id/comments](./posts_api.md#get-comments-for-post)
- [POST /api/posts/:post_id/comments](./posts_api.md#create-comment-on-post)
- [GET /api/posts/:post_id/like](./posts_api.md#get-likes-for-post)
- [POST /api/posts/:post_id/like](./posts_api.md#create-like-on-post)
- [DELETE /api/posts/:post_id/like](./posts_api.md#delete-like-on-post)

### Categories (`/api/categories`)

- [GET /api/categories](./categories_api.md#get-all-categories)
- [GET /api/categories/:category_id](./categories_api.md#get-category-by-id)
- [GET /api/categories/:category_id/posts](./categories_api.md#get-posts-for-a-category)
- [POST /api/categories](./categories_api.md#create-category-admin-only)
- [PATCH /api/categories/:category_id](./categories_api.md#update-category-admin-only)
- [DELETE /api/categories/:category_id](./categories_api.md#delete-category-admin-only)

### Comments (`/api/comments`)

- [GET /api/comments/:comment_id](./comments_api.md#get-comment-by-id)
- [PATCH /api/comments/:comment_id](./comments_api.md#update-comment)
- [DELETE /api/comments/:comment_id](./comments_api.md#delete-comment)
- [GET /api/comments/:comment_id/like](./comments_api.md#get-likes-for-comment)
- [POST /api/comments/:comment_id/like](./comments_api.md#create-like-on-comment)
- [DELETE /api/comments/:comment_id/like](./comments_api.md#delete-like-on-comment)
- [POST /api/comments/:comment_id/solution](./comments_api.md#mark-comment-as-solution)
- [DELETE /api/comments/:comment_id/solution](./comments_api.md#unmark-comment-as-solution)
