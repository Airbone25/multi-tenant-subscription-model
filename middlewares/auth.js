import { verifyToken } from "../utils/jwt"

export function verifyAuth(req,res,next){
    let token = req.headers.authorization
    if(!token) return res.status(401).json({message: "Token Missing or Invalid"})
    
    if(token.startsWith("Bearer ")) token = token.split(" ")[1]
    
    try{
        const decoded = verifyToken(token)
        req.user = {
            user_id: decoded.user_id,
            org_id: decoded.org_id,
            role: decoded.role
        }
        next()
    }catch(error){
        res.json({message: "Invalid missing"})
    }
}