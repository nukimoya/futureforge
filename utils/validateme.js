const VALIDATION_RULES = {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 20,
    PASSWORD_MIN_LENGTH: 8
  };
  
const validateUsername = (username) => {
    if (!username || typeof username !== 'string') {
        return 'Username is required';
    }
    if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
        return `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`;
    }
    if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
        return `Username must be less than ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters`;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
};

const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
        return `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`;
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
};

module.exports = { validatePassword, validateUsername};