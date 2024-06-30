import { asyncHandler } from "../utils/errorHandling.js";
import jwt from "jsonwebtoken"
import userModel from './../../DB/model/user.model.js';


export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.headers
    if (!token?.startsWith(process.env.BEARER_KEY)) {
        return next(new Error("VALID TOKEN IS Required", { cause: 400 }))
    }
    const payload = token.split(process.env.BEARER_KEY)[1]
    try {
        const decoded = jwt.verify(payload, process.env.TOKEN_SINGATURE)
        const user = await userModel.findById(decoded.id)
        if (!user) {
            return next(new Error("User Not Found", { cause: 404 }))
        }
        if (user.status != "online") {
            return next(new Error("Please LOGIN", { cause: 401 }))
        }
        req.user = user
        return next()
    } catch (error) {
        // refreshToken
        if (error == "TokenExpiredError: jwt expired") {
            const findUser = await userModel.findOne({ token: payload })
            if (!findUser) {
                return next(new Error("Wrong Token"), { cause: 400 })
            }
            const refreshToken = jwt.sign({ id: findUser._id, email: findUser._email }, process.env.TOKEN_SINGATURE, { expiresIn: '1h' })
            findUser.token = refreshToken
            await findUser.save()
            return res.status(200).json({ message: "Refresh token", refreshToken })
        }
    }

})