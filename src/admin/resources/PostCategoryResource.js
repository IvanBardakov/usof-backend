const PostCategoryResource = {
  resource: "post_categories",
  options: {
    navigation: "Content",
    properties: {
      post_id: { isReference: true, reference: "posts" },
      category_id: { isReference: true, reference: "categories" },
    },
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
    },
  },
};

export default PostCategoryResource;
