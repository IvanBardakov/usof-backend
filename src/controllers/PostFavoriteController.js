import postFavoriteModel from "../models/PostFavorite.js";
import postModel from "../models/Post.js";
import postCategoryModel from "../models/PostCategory.js";
import categoryModel from "../models/Category.js";
import postSubscriptionModel from "../models/PostSubscription.js";

class PostFavoriteController {
  async add(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.post_id;

      const success = await postFavoriteModel.add(userId, postId);
      res.json({ success });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async remove(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.post_id;

      const success = await postFavoriteModel.remove(userId, postId);
      res.json({ success });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUserFavorites(req, res) {
    try {
      const userId = req.user.id;

      const favoritePostIds = await postFavoriteModel.getUserFavorites(userId);
      if (!favoritePostIds.length) return res.json({ posts: [], count: 0 });

      const posts = await Promise.all(
        favoritePostIds.map(async (postId) => {
          const post = await postModel.findById(postId);
          if (!post) return null;

          const categoryIds =
            await postCategoryModel.getCategoriesForPost(postId);
          const categories = await Promise.all(
            categoryIds.map((id) => categoryModel.findById(id))
          );

          return {
            ...post,
            categories: categories.filter(Boolean),
            isFavorited: true,
            isSubscribed: await postSubscriptionModel.isSubscribed(
              userId,
              postId
            ),
          };
        })
      );

      res.json({
        posts: posts.filter(Boolean),
        count: posts.filter(Boolean).length,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new PostFavoriteController();
