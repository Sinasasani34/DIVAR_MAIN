const CookieNames = require("../../common/constant/cookie.enum");
const NodeEnv = require("../../common/constant/env.enum");
const { AuthMessage } = require("./auth.messages");
const authService = require("./auth.service");
const autoBind = require("auto-bind");
// npm install --save auto-bind@3
class AuthController {
    #service;
    constructor() {
        autoBind(this)
        this.#service = authService;
    }
    // send otp sms
    async sendOTP(req, res, next) {
        try {
            const { mobile } = req.body;
            await this.#service.sendOTP(mobile);
            return res.json({
                message: AuthMessage.sendOPTSuccessfully
            });
        } catch (error) {
            next(error);
        }
    }
    // check otp sms
    async checkOTP(req, res, next) {
        try {
            const { mobile, code } = req.body;
            const token = await this.#service.checkOTP(mobile, code);
            return res.cookie(CookieNames.AccessToken, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === NodeEnv.Production
            }).status(200).json({
                message: AuthMessage.LoginSuccessfully,
            });
        } catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            return res.clearCookie(CookieNames.AccessToken).status(200).json({
                message: AuthMessage.logoutSuccessfully
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();