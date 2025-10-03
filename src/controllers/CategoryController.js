// src/controllers/CategoryController.js

import categoryModel from "../models/Category.js";
import postCategoryModel from "../models/PostCategory.js";
import postModel from "../models/Post.js";
import postFavoriteModel from "../models/PostFavorite.js";
import postSubscriptionModel from "../models/PostSubscription.js";

class CategoryController {
  async getAll(req, res) {
    try {
      const categories = await categoryModel.findAll();
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const category = await categoryModel.findById(req.params.category_id);
      if (!category)
        return res.status(404).json({ error: "Category not found" });
      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const { title, description } = req.body;
      if (!title) return res.status(400).json({ error: "Title is required" });
      const categoryId = await categoryModel.create({ title, description });
      res.status(201).json({ categoryId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const updated = await categoryModel.updateById(
        req.params.category_id,
        req.body
      );
      if (!updated)
        return res
          .status(404)
          .json({ error: "Category not found or not updated" });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await categoryModel.deleteById(req.params.category_id);
      if (!deleted)
        return res
          .status(404)
          .json({ error: "Category not found or not deleted" });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPostsForCategory(req, res) {
    try {
      const categoryId = req.params.category_id;
      const userId = req.session.user?.id;

      const posts = await postModel.findAll({
        category: categoryId,
        sort: "likes",
        order: "desc",
      });

      const formattedPosts = await Promise.all(
        posts.map(async (post) => {
          const { author_id, author_login, author_profile_picture, ...rest } =
            post;

          const categoryIds = await postCategoryModel.getCategoriesForPost(
            post.id
          );
          const categories = await Promise.all(
            categoryIds.map((id) => categoryModel.findById(id))
          );

          let isFavorited = false;
          let isSubscribed = false;
          if (userId) {
            isFavorited = await postFavoriteModel.isFavorited(userId, post.id);
            isSubscribed = await postSubscriptionModel.isSubscribed(
              userId,
              post.id
            );
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
        })
      );

      res.json(formattedPosts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CategoryController();
