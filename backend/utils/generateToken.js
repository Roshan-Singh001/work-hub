import jwt, { decode } from "jsonwebtoken"

export const generateToken = (userId, role) => {
    const secretKey = process.env.JWT_SECRET;

    return jwt.sign(
        {id: userId, role: role},
        secretKey,
        {
            expiresIn: "7d"
        }
    )
}

export const verifyToken = (token) => {
    const secretKey = process.env.JWT_SECRET;

    return jwt.verify(
        token,
        secretKey,
        (err, decoded)=>{
            if (err) {
                throw new Error("Invalid token");
            }
            return decoded;
        }
    )
}