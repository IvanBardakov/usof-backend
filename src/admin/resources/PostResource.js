// src/admin/resources/PostResource.js
const PostResource = {
  resource: "posts",
  options: {
    navigation: "Content",
    properties: {
      id: { isVisible: { list: true, show: true, edit: false, filter: true } },
      author_id: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      title: { isVisible: true, isDisabled: false },
      content: {
        type: "richtext",
        isVisible: { list: true, show: true, edit: true, filter: true },
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
        isAccessible: ({ currentAdmin }) => {
          return currentAdmin && currentAdmin.role === "admin";
        },
        before: async (request, context) => {
          const { currentAdmin, record } = context;
          if (
            request.method === "post" &&
            record &&
            record.id &&
            record.param("author_id") !== currentAdmin.id
          ) {
            if (request.payload) {
              request.payload = { status: request.payload.status };
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

export default PostResource;
