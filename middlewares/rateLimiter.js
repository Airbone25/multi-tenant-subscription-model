import { prisma } from "../lib/prisma"
import redis from "../lib/redis"

export async function rateLimiter(req,res,next){
    const apiKeyId = req.apiKeyId
    const planName = req.plan.name
    try{
        const limit = await prisma.plan.findUnique({
            where: {name: planName},
            select: {rateLimit: true}
        })
        const currentSecond = Math.floor(Date.now()/1000)
        const redisKey = `rate:${apiKeyId}:${currentSecond}`

        const counter = await redis.incr(redisKey)
        if(counter === 1){
            await redis.expire(redisKey,1)
        }
        if(counter > limit){
            return res.status(429).json({message: "Rate Limit Exceeded!"})
        }
        next()
    }catch(error){
        console.error(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}