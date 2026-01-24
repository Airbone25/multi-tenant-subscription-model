import express from 'express'
import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt"
import {signToken} from "../utils/jwt"
import { verifyAuth } from '../middlewares/auth'

const router = express.Router()

router.post('/signup',async (req,res)=>{
    const {email,password,org_name} = req.body
    if(!email || !password || !org_name) return res.json({message: "Missing Fields"})
    try{
        const existingUser = await prisma.user.findUnique({where: {email}})
        if(existingUser) return res.json({message: "User already exist!"})
        
        const hashPass = await bcrypt.hash(password,10)

        // const normOrg = org_name.trim().toLowerCase()

        const result = await prisma.$transaction(async (tx)=>{
            let org = await tx.organization.findFirst({
                where: {name: org_name}
            })
            let role = "MEMBER"
            if(!org){
                const defaultPlan = await tx.plan.findUnique({where: {name: "Free"}})
                if(!defaultPlan) throw new Error("No Default Plan")
                
                org = await tx.organization.create({
                    data: {
                        name: org_name.trim(),
                        plan_id: defaultPlan.id
                    }
                })
                role = "OWNER"
            }
            const user = await tx.user.create({
                data: {
                    email: email,
                    password: hashPass,
                    role: role,
                    org_id: org.id
                }
            })
            return {user,org}
        })

        const token = signToken({
            user_id: result.user.id,
            org_id: result.org.id,
            role: result.role
        })

        res.send({
            message: "Signup Successful",
            token: token
        })

    }catch(error){
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    try{
        const currUser = await prisma.user.findUnique({where: {email: email}})
        if(!currUser) return res.json({message: "Cannot find user"})
        
        const isMatch = await bcrypt.compare(password,currUser.password)
        if(!isMatch) return res.json({message: "Wrong Password"})
        
        const token = signToken({
            user_id: currUser.id,
            org_id: currUser.org_id,
            role: currUser.role
        })

        res.json({
            message: "Login Successful",
            token: token
        })
    }catch(error){
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
})

router.get('/me',verifyAuth,async (req,res)=>{
    const data = await prisma.user.findUnique({where: {id: req.user.user_id},select: {id: true,email: true,org_id: true}})
    if(!data) return res.json({message: "User Not Found"})
    
    res.json(data)
})



export default router