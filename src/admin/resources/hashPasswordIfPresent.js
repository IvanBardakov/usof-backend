// src/admin/resources/hashPasswordIfPresent.js

import bcrypt from "bcrypt";

export const hashPasswordIfPresent = async (request) => {
  if (request.payload && request.payload.password) {
    request.payload = {
      ...request.payload,
      password: await bcrypt.hash(request.payload.password, 10),
    };
  }
  return request;
};
