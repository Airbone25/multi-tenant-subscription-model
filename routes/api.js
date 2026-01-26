import express from 'express'
import { prisma } from '../lib/prisma'
import { orgScope, verifyAuth, verifyOwner } from '../middlewares/auth'
import crypto from 'crypto'

const router = express.Router()

router.post('/',verifyAuth,orgScope,verifyOwner,async (req,res)=>{
    try{
        const org = await prisma.organization.findUnique({
            where: {id: req.orgId},
            select: {plan: true}
        })
        
        if(!org || !org.plan) return res.status(400).json({message: "No org or plan found"})

        const apiKeyCount = await prisma.apiKey.count({
            where: {org_id: req.orgId}
        })

        if(apiKeyCount >= org.plan.maxApiKeys){
            return res.status(403).json({message: "Api key limit reached. Upgrade your plan!"})
        }

        const rawKey = crypto.randomBytes(8).toString('hex')
        const hashKey = crypto.createHash('sha256').update(rawKey).digest('hex')

        await prisma.apiKey.create({data: {
            key: hashKey,
            org_id: req.orgId
        }})

        res.status(201).json({apiKey: rawKey,message: "The key will be shown one time only"})

    }catch(error){
        res.status(500).json({message: "Internal Server Error"})
        console.error(error)
    }
})

export default router