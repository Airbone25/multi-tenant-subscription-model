import crypto from 'crypto'
import {prisma} from '../lib/prisma'

export async function verifyApiKey(req,res,next){
    try{
        const rawKey = req.headers['x-api-key']
        if(!rawKey) return res.status(401).json({message: "Api Key Missing!"})
        const hashKey = crypto.createHash('sha256').update(rawKey).digest('hex')
        
        const apiKey = await prisma.apiKey.findUnique({
            where: {key: hashKey},
            include: {organization: {include: {plan: true}}}
        })

        if(!apiKey) return res.status(403).json({message: "Invalid Api Key"})
        
        req.orgId = apiKey.org_id
        req.apiKeyId = apiKey.id
        req.plan = apiKey.organization.plan

        next()

    }catch(error){
        res.status(500).json({message: "Internal Server Error"})
        console.error(error)
    }
}