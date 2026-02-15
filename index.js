import 'dotenv/config'
import express from 'express';
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

import authRoutes from './routes/auth'
app.use('/auth',authRoutes)

import orgRoutes from './routes/org'
app.use('/org',orgRoutes)

import apiKeyRoutes from './routes/api'
app.use('/api-key',apiKeyRoutes)

import productRoutes from './routes/product'
app.use('/v1/email',productRoutes)

app.listen(3000,()=>{
    console.log("Server is running!")
})