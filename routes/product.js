import express from 'express'
import { verifyApiKey } from '../middlewares/apiKey'
import { rateLimiter } from '../middlewares/rateLimiter'

const router = express.Router()

router.get('/',verifyApiKey,rateLimiter,(req,res)=>{
    res.send('Product Api')
})

export default router