// src/services/NotificationService.js
import transporter from "../config/mailConfig.js";
import postSubscriptionModel from "../models/PostSubscription.js";

class NotificationService {
  async notifySubscribersNewComment({ post, author, content }) {
    try {
      const subscribers = await postSubscriptionModel.getSubscribers(post.id);

      const emails = subscribers
        .filter((sub) => sub.id !== author.id)
        .map((sub) =>
          transporter.sendMail({
            from: "usofsup@gmail.com",
            to: sub.email,
            subject: `New comment on: ${post.title}`,
            text: `${author.login} commented on "${post.title}":\n\n${content}`,
          }),
        );

      await Promise.allSettled(emails);
    } catch (err) {
      console.error("Error notifying subscribers:", err);
    }
  }
}

export default new NotificationService();
