import express from 'express'
import { verifyOwner,verifyAuth, orgScope } from '../middlewares/auth'
import { prisma } from '../lib/prisma'

const router = express.Router()

router.get('/',verifyAuth,orgScope,verifyOwner,async(req,res)=>{
    const orgDetails = await prisma.organization.findFirst({
        where: {id: req.orgId}
    })
    res.json(orgDetails)
})

export default router