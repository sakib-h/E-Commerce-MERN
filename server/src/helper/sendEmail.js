const sendEmailWithNodemailer = require("./email");
const createError = require("http-errors");
const sendEmail = async (emailData) => {
    try {
        await sendEmailWithNodemailer(emailData);
    } catch (error) {
        throw createError(500, "Failed to send verification email");
    }
};

module.exports = sendEmail;
