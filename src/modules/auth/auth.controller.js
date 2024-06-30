import { asyncHandler } from './../../utils/errorHandling.js';
import userModel from './../../../DB/model/user.model.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sendEmail from './../../utils/email.js';
import { resetPassTemp, signUpTemp } from './../../utils/htmlTemplates.js';
import Randomstring from 'randomstring';
import cartModel from './../../../DB/model/cart.model.js';
import { OAuth2Client } from 'google-auth-library'



//signup
export const signup = asyncHandler(async (req, res, next) => {
    const { email, userName, password, cPassword } = req.body
    const checkUser = await userModel.findOne({ email })
    if (checkUser) {
        return next(new Error("email already Exist", { cause: 409 }))
    }
    if (password != cPassword) {
        return next(new Error("MisMatch Password", { cause: 400 }))
    }
    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND))
    const user = await userModel.create({ email, userName, password: hashPassword })
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SINGATURE, { expiresIn: 60 * 5 })
    const confirmationLink = `${req.protocol}://${req.headers.host}/auth/activate_account/${token}`
    const confirmationEmail = sendEmail({
        to: email,
        subject: "Activate Account",
        html: signUpTemp(confirmationLink)
    })
    if (!confirmationEmail) {
        return next(new Error("SOMETHING WENT WRONG", { cause: 400 }))
    }
    return res.status(201).json({ message: "Done", user })
})


//loginWithGmail
export const loginWithGmail = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body
    const client = new OAuth2Client(process.env.CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload
    }
    const { email, email_verified, name, picture } = await verify()
    if (!email_verified) {
        return next(new Error("IN VALID EMAIL", { cause: 400 }))
    }
    const checkUser = await userModel.findOne({ email })
    if (checkUser) {
        //login
        if (checkUser.provider != "google") {
            return next(new Error(`IN VALID Provider .. true Provider is ${checkUser.provider}`, { cause: 400 }))
        }
        const token = jwt.sign({ id: checkUser._id, email: checkUser.email }, process.env.TOKEN_SINGATURE)
        checkUser.status = "online"
        await checkUser.save()
        return res.status(200).json({ message: "Done", checkUser, token })
    }
    //signup
    const customPassword = Randomstring.generate({
        charset: "alphanumeric",
        length: 9
    })
    const hashPassword = bcrypt.hashSync(customPassword, parseInt(process.env.SALT_ROUND))
    const user = await userModel.create({
        email,
        userName: name,
        password: hashPassword,
        provider: "google",
        isConfirmed: true,
        status: "online",
        profileImages: { url: picture }
    })
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SINGATURE)
    return res.status(201).json({ message: "Done", user, token })
})



//activate_account
export const activate_account = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.TOKEN_SINGATURE)
    const user = await userModel.findByIdAndUpdate({ _id: decoded.id }, { isConfirmed: true }, { new: true })
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    await cartModel.create({ userId: user._id })
    return res.status(200).json({ message: "Done", user })
})


//login
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error("IN-VALID EMAIL", { cause: 404 }))
    }
    if (!user.isConfirmed) {
        return next(new Error("Activate Your Account First", { cause: 400 }))
    }
    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
        return next(new Error("IN-CORRECT PASSWORD", { cause: 404 }))
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SINGATURE, { expiresIn: 60 * 60 * 30 })
    user.status = "online"
    user.token = token
    await user.save()
    return res.status(200).json({ message: "Done", user, token })
})


//forgetCode
export const forgetCode = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error("IN-VALID EMAIL", { cause: 404 }))
    }
    if (!user.isConfirmed) {
        return next(new Error("Activate Your Account First", { cause: 400 }))
    }
    const forgetCode = Randomstring.generate({
        charset: "numeric",
        length: 5
    })
    user.forgetCode = forgetCode
    await user.save()

    const forgetCodeEmail = sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: resetPassTemp(forgetCode)
    })
    if (!forgetCodeEmail) {
        return next(new Error("SOMETHING WENT WRONG", { cause: 400 }))
    }
    return res.status(200).json({ message: "Done" })
})


//resetPassword
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, forgetCode, password, cPassword } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error("IN-VALID EMAIL", { cause: 404 }))
    }
    if (user.forgetCode != forgetCode) {
        return next(new Error("IN-VALID CODE", { cause: 400 }))
    }
    if (password != cPassword) {
        return next(new Error("MisMatch Password", { cause: 400 }))
    }
    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND))
    const updatedUser = await userModel.findByIdAndUpdate({ _id: user._id }, { password: hashPassword, status: "offline" }, { new: true })
    return res.status(200).json({ message: "Done", updatedUser })
})


export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await userModel.find()
    return res.status(200).json({ message: "Done", users })
})