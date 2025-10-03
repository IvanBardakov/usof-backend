// src/utils/validationUtils.js
// Utility functions for validating email, login, and password formats

function isValidEmail(email) {
  // Simple regex for email validation
  return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
}

function isValidLogin(login) {
  // Login: 3-30 chars, letters, numbers, underscores
  return /^[a-zA-Z0-9_]{3,30}$/.test(login);
}

function isStrongPassword(password) {
  // Password: min 8 chars, at least one uppercase, one lowercase, one digit, one special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password,
  );
}

export { isValidEmail, isValidLogin, isStrongPassword };
