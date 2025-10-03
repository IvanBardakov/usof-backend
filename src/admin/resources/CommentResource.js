// src/admin/resources/CommentResource.js
const CommentResource = {
  resource: "comments",
  options: {
    navigation: "Content",
    properties: {
      id: { isVisible: { list: true, show: true, edit: false, filter: true } },
      post_id: {
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      author_id: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      content: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      publish_date: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      status: {
        availableValues: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      updated_at: { isVisible: false },
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
      },
      edit: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
        before: async (request) => {
          if (request.method === "post") {
            if (request.payload) {
              delete request.payload.content;
            }
          }
          return request;
        },
      },
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

export default CommentResource;
