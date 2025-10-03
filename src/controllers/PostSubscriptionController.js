import postSubscriptionModel from "../models/PostSubscription.js";
import postModel from "../models/Post.js";
import postFavoriteModel from "../models/PostFavorite.js";
import postCategoryModel from "../models/PostCategory.js";
import categoryModel from "../models/Category.js";

class PostSubscriptionController {
  async subscribe(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.post_id;

      await postSubscriptionModel.subscribe(userId, postId);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async unsubscribe(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.post_id;

      await postSubscriptionModel.unsubscribe(userId, postId);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async listSubscriptions(req, res) {
    try {
      const userId = req.user.id;

      const subscribedPostIds = (
        await postSubscriptionModel.getByUser(userId)
      ).map((p) => p.id);
      if (!subscribedPostIds.length) return res.json({ posts: [], count: 0 });

      const posts = await Promise.all(
        subscribedPostIds.map(async (postId) => {
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
            isFavorited: await postFavoriteModel.isFavorited(userId, postId),
            isSubscribed: true,
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

export default new PostSubscriptionController();
