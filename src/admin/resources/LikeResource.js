// src/admin/resources/LikeResource.js
const LikeResource = {
  resource: "likes",
  options: {
    navigation: "Content",
    properties: {
      id: { isVisible: { list: true, show: true, edit: false, filter: true } },
      author_id: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      post_id: {
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      comment_id: {
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      type: {
        availableValues: [
          { value: "like", label: "Like" },
          { value: "dislike", label: "Dislike" },
        ],
      },
      publish_date: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
        before: async (request, context) => {
          if (request.payload) {
            request.payload.author_id = context.currentAdmin.id;
          }
          return request;
        },
        after: async (response, request, context) => {
          if (
            response &&
            response.notice &&
            response.notice.message &&
            (response.notice.message.includes("ER_DUP_ENTRY") ||
              response.notice.message.includes("Duplicate entry"))
          ) {
            response.notice = {
              message:
                "You have already liked or disliked this post or comment.",
              type: "error",
            };
          }
          if (response && response.record && response.record.errors) {
            const errors = response.record.errors;
            for (const key in errors) {
              if (
                errors[key].message &&
                (errors[key].message.includes("ER_DUP_ENTRY") ||
                  errors[key].message.includes("Duplicate entry"))
              ) {
                errors[key].message =
                  "You have already liked or disliked this post or comment.";
              }
            }
          }
          return response;
        },
      },
      edit: { isAccessible: false },
      delete: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
      },
      list: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
      },
      show: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
      },
    },
  },
};

export default LikeResource;
