const autoBind = require("auto-bind");
const UserModel = require("../user/user.model");
const createHttpError = require("http-errors");
const { AuthMessage } = require("./auth.messages");
const { randomInt } = require("crypto")
const jwt = require("jsonwebtoken");
class AuthService {
    #model;
    constructor() {
        autoBind(this);
        this.#model = UserModel;
    }
    // send otp sms
    async sendOTP(mobile) {

        const user = await this.#model.findOne({ mobile });
        const now = new Date().getTime();
        const opt = {
            code: randomInt(10000, 99999),
            expiresIn: now + (1000 * 60 * 2)
        }

        if (!user) {
            const newUser = await this.#model.create({ mobile, opt, })
            return newUser;
        }
        if (user.otp && user.otp.expiresIn > now) {
            throw new createHttpError.BadRequest(AuthMessage.OtpCodeNotExpired)
        }
        user.otp = opt;
        await user.save();
        return user;
    }
    // check otp sms
    async checkOTP(mobile, code) {
        const user = await this.checkExistByMobile(mobile)
        const now = new Date().getTime();
        if (user?.otp?.expiresIn < now) throw new createHttpError.Unauthorized(AuthMessage.OtpCodeExpired)
        if (user?.otp?.code !== code) throw new createHttpError.Unauthorized(AuthMessage.OTPCodeIsInCorrect)
        if (!user.verifiedMobile) {
            user.verifiedMobile = true;
            await user.save();
        }
        const accessToken = this.signToken({ mobile, id: user._id })
        user.accessToken = accessToken;
        // return user;
        return accessToken;
    }

    async checkExistByMobile(mobile) {
        const user = await this.#model.findOne({ mobile });
        if (!user) throw new createHttpError.NotFound(AuthMessage.NotFound);
        return user;
    }

    signToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1y" })
    }
}

module.exports = new AuthService();