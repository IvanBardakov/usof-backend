// src/admin/resources/UserResource.js

import AdminJSSQL from "@adminjs/sql";
import { hashPasswordIfPresent } from "./hashPasswordIfPresent.js";

const setDefaultAvatar = async (request) => {
  if (request.payload && !request.payload.profile_picture) {
    request.payload = {
      ...request.payload,
      profile_picture: "/uploads/avatars/default.png",
    };
  }
  return request;
};

const UserResource = {
  resource: "users",
  options: {
    navigation: "User Management",
    properties: {
      password: {
        type: "password",
        isVisible: { list: false, edit: true, filter: false, show: false },
      },
      created_at: { isVisible: false },
      updated_at: { isVisible: false },
      role: {
        type: "string",
        isVisible: { list: true, edit: true, filter: true, show: true },
      },
    },
    actions: {
      new: {
        before: async (request) => {
          request = await setDefaultAvatar(request);
          request = await hashPasswordIfPresent(request);
          return request;
        },
      },
      edit: {
        before: hashPasswordIfPresent,
      },
    },
  },
};

export default UserResource;
