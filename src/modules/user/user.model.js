const { Schema, model } = require("mongoose");

// otp = one time password
const OTPSchema = new Schema({
    code: { type: String, required: false, default: undefined },
    expiresIn: { type: Number, required: false, default: 0 },
})

const userSchema = new Schema({
    fullName: { type: String, required: false },
    mobile: { type: String, unique: true, required: true },
    otp: { type: OTPSchema },
    verifyedMobile: { type: Boolean, default: false, required: true },
    accessToken: { type: String },
}, { timestamps: true })

const userModel = model("user", userSchema);

module.exports = userModel;