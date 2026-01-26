import 'dotenv/config'
import express from 'express';

const app = express()

app.use(express.json())

import authRoutes from './routes/auth'
app.use('/auth',authRoutes)

import orgRoutes from './routes/org'
app.use('/org',orgRoutes)

import apiKeyRoutes from './routes/api'
app.use('/api-key',apiKeyRoutes)

import productRoutes from './routes/product'
app.use('/product',productRoutes)

app.listen(3000,()=>{
    console.log("Server is running!")
})