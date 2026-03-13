import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
    const secretKey = process.env.JWT_SECRET;

    return jwt.sign(
        {userId},
        secretKey,
        {
            expiresIn: "7d"
        }
    )
}