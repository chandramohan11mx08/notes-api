var validator = require('validator');

function validateEmailAndPassword(email, password) {
    var isValidEmail = validator.isEmail(email);
    var isValidPassword = !validator.isNull(password);
    var messages = [];
    if (isValidEmail && isValidPassword) {
        return {'isValid': true};
    }
    if (!isValidEmail) {
        messages.push("Email is not valid");
    }
    if (!isValidPassword) {
        messages.push("Password is not valid");
    }
    return {'isValid': false, 'messages': messages};
}

function validateTitleAndDescription(title, description) {
    var isValidTitle = !validator.isNull(title);
    var isValidDescription = !validator.isNull(description);
    var messages = [];
    if (isValidTitle && isValidDescription) {
        return {'isValid': true};
    }
    if (!isValidTitle) {
        messages.push("Title should not be empty");
    }
    if (!isValidDescription) {
        messages.push("Description should not be empty");
    }
    return {'isValid': false, 'messages': messages};
}

exports.validateEmailAndPassword = validateEmailAndPassword;
exports.validateTitleAndDescription = validateTitleAndDescription;