import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'

const app = express()

dotenv.config()

//Routes
import authRoute from './routes/auth.route.js';
app.use("/api/auth", authRoute)



const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Listening on port PORT: ${PORT}`)
    connectDB()
})