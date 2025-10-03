const PostSubscriptionResource = {
  resource: "post_subscriptions",
  options: {
    navigation: "User Activity",
    properties: {
      user_id: { isReference: true, reference: "users" },
      post_id: { isReference: true, reference: "posts" },
      created_at: { isVisible: { list: true, show: true, edit: false } },
    },
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
    },
  },
};

export default PostSubscriptionResource;
