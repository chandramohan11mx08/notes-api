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

exports.validateEmailAndPassword = validateEmailAndPassword;