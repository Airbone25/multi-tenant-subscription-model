import 'dotenv/config'
import express from 'express';

const app = express()

app.use(express.json())

import authRoutes from './routes/auth'
app.use('/auth',authRoutes)

import orgRoutes from './routes/org'
app.use('/org',orgRoutes)

app.listen(3000,()=>{
    console.log("Server is running!")
})