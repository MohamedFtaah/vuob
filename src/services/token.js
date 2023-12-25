const jwt = require("jsonwebtoken")

//For activation token
exports.signActivationToken = (payload) => {
    return jwt.sign(
        {payload},
        process.env.JWT_ACTIVATION_SECRET,
        {
            expiresIn:process.env.JWT_ACTIVATION_EXPIRES_IN
        }
        ) 
}

//For generate token
exports.signToken = (payload) => {
    return jwt.sign(
        {payload},
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN
        }
        ) 
}