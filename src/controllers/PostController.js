// src/controllers/PostController.js
import postModel from "../models/Post.js";
import categoryModel from "../models/Category.js";
import postCategoryModel from "../models/PostCategory.js";
import postFavoriteController from "./PostFavoriteController.js";
import postSubscriptionController from "./PostSubscriptionController.js";
import postFavoriteModel from "../models/PostFavorite.js";
import postSubscriptionModel from "../models/PostSubscription.js";

class PostController {
  async getAll(req, res) {
    try {
      const {
        status,
        category,
        sort = "likes",
        order = "desc",
        limit = 10,
        page = 1,
        date_from,
        date_to,
        author_id,
      } = req.query;
      const limitNum = Number(limit);
      const pageNum = Number(page);
      const offset = (pageNum - 1) * limitNum;

      const userId = req.session.user?.id;
      const isAdmin = req.session.user?.role === "admin";

      const baseOptions = {
        category,
        sort,
        order,
        limit: limitNum,
        offset,
        date_from,
        date_to,
      };
      let posts, totalPosts;

      if (author_id) {
        const authorIdNum = Number(author_id);
        let effectiveStatus =
          isAdmin || (userId && authorIdNum === userId) ? status : "active";
        const queryOptions = { ...baseOptions, author_id: authorIdNum };
        if (effectiveStatus) queryOptions.status = effectiveStatus;

        const result = await postModel.findAllWithCount(queryOptions);
        posts = result.posts;
        totalPosts = result.count;
      } else if (userId && !isAdmin) {
        const result = await postModel.findAllWithUserVisibilityWithCount({
          userId,
          ...baseOptions,
        });
        posts = result.posts;
        totalPosts = result.count;
      } else {
        let queryOptions = { ...baseOptions };

        if (isAdmin) {
          if (status) {
            queryOptions.status = status;
          }
        } else {
          queryOptions.status = "active";
        }

        const result = await postModel.findAllWithCount(queryOptions);
        posts = result.posts;
        totalPosts = result.count;
      }

      const postsWithExtras = await Promise.all(
        posts.map((post) => this._enrichPost(post, userId))
      );

      res.json({
        posts: postsWithExtras,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalPosts,
          totalPages: Math.ceil(totalPosts / limitNum),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const post = req.post;
      const userId = req.session.user?.id;

      const enrichedPost = await this._enrichPost(post, userId);
      res.json(enrichedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const { title, content, categories } = req.body;
      if (
        !title ||
        !content ||
        !Array.isArray(categories) ||
        categories.length === 0
      ) {
        return res.status(400).json({
          error: "Title, content, and at least one category are required",
        });
      }

      const categoriesExist = await categoryModel.existsByIds(categories);
      if (!categoriesExist)
        return res
          .status(400)
          .json({ error: "One or more categories do not exist" });

      const author_id = req.session.user.id;
      const postId = await postModel.create({ author_id, title, content });

      for (const category_id of categories) {
        await postCategoryModel.add(postId, category_id);
      }

      res.status(201).json({ postId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const { title, content, categories, status } = req.body;
      const postId = req.params.post_id;
      const post = await postModel.findById(postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const updateData = {};

      if (post.author_id === req.user.id) {
        if (title) updateData.title = title;
        if (content) updateData.content = content;
      }

      if (req.user.role === "admin" && status) {
        updateData.status = status;
      }

      let categoriesToUpdate = null;
      if (Array.isArray(categories)) {
        categoriesToUpdate = categories;
      }

      if (!Object.keys(updateData).length && !categoriesToUpdate) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      await postModel.updateById(postId, updateData);

      if (categoriesToUpdate) {
        const categoriesExist =
          await categoryModel.existsByIds(categoriesToUpdate);
        if (!categoriesExist)
          return res
            .status(400)
            .json({ error: "One or more categories do not exist" });

        await postCategoryModel.removeAllForPost(postId);
        for (const category_id of categoriesToUpdate) {
          await postCategoryModel.add(postId, category_id);
        }
      }

      if (updateData.status === "inactive") {
        const favoritedUsers = await postFavoriteModel.getPostFavorites(postId);
        for (const user_id of favoritedUsers) {
          await postFavoriteModel.remove(user_id, postId);
        }

        const subscribers = await postSubscriptionModel.getSubscribers(postId);
        for (const user of subscribers) {
          await postSubscriptionModel.unsubscribe(user.id, postId);
        }
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      await postModel.deleteById(req.params.post_id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCategories(req, res) {
    try {
      const categoryIds = await postCategoryModel.getCategoriesForPost(
        req.params.post_id
      );
      if (!categoryIds.length) return res.json([]);
      const allCategories = await Promise.all(
        categoryIds.map((id) => categoryModel.findById(id))
      );
      res.json(allCategories.filter(Boolean));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async _enrichPost(post, userId) {
    const { author_login, author_profile_picture, author_id, ...rest } = post;

    const categoryIds = await postCategoryModel.getCategoriesForPost(post.id);
    const categories = await Promise.all(
      categoryIds.map((id) => categoryModel.findById(id))
    );

    let isFavorited = false;
    let isSubscribed = false;
    if (userId) {
      isFavorited = await postFavoriteModel.isFavorited(userId, post.id);
      isSubscribed = await postSubscriptionModel.isSubscribed(userId, post.id);
    }

    return {
      ...rest,
      author: {
        id: author_id,
        login: author_login,
        profile_picture: author_profile_picture,
      },
      categories: categories.filter(Boolean),
      isFavorited,
      isSubscribed,
    };
  }
}

export default new PostController();
