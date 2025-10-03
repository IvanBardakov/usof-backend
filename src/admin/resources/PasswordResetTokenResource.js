const PasswordResetTokenResource = {
  resource: "password_reset_tokens",
  options: {
    navigation: "Administration",
    properties: {
      user_id: { isReference: true, reference: "users" },
      token: {
        isVisible: { list: false, show: true, edit: false, filter: false },
      },
      expires_at: { isVisible: true },
      used: { type: "boolean" },
    },
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
    },
  },
};

export default PasswordResetTokenResource;
