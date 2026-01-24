import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

export function signToken(data){
    return jwt.sign(data,secret,{expiresIn: "1d"})
}

export function verifyToken(token){
    return jwt.verify(token,secret)
}
