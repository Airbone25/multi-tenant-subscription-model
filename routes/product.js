import express from 'express'
import { verifyApiKey } from '../middlewares/apiKey'

const router = express.Router()

router.get('/',verifyApiKey,(req,res)=>{
    res.send('Product Api')
})

export default router