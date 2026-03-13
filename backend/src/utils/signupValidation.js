const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, password, emailId, photoUrl } = req.body;

    if (!firstName || firstName.length < 2 || firstName.length > 50) {
        throw new Error("First name must be between 2 and 50 characters.");
    }
    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Please enter a valid email address.");
    }
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Password is too weak. Include uppercase, numbers, and symbols.");
    }
    if (photoUrl && !validator.isURL(photoUrl)) {
        throw new Error("Invalid Photo URL.");
    }
};

module.exports = { validateSignUpData };