// src/admin/resources/CategoryResource.js
const CategoryResource = {
  resource: "categories",
  options: {
    navigation: "Content",
    properties: {
      id: { isVisible: { list: true, show: true, edit: false, filter: true } },
      title: { isVisible: true },
      description: { isVisible: true },
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
      },
      edit: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
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

export default CategoryResource;
