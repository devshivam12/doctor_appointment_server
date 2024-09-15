import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import authRoute from './routes/authRoute.js'
import userRouter from './routes/user.route.js'
import doctorRouter from './routes/doctor.route.js'
import reviewRouter from './routes/review.route.js'
import { errorMiddleware } from "./middleware/error.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

const corsOption = {
    origin: true
}

//data base set

mongoose.set('strictQuery', false)

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        console.log("Mongo db is connected")
    } catch (error) {
        console.log("Mongodb connection is failed")
    }
}


//middleware 

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOption))

app.get('/', (req, res) => {
    res.send("Api is working")
})

// routes 

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/doctor', doctorRouter)
app.use('/api/v1/review', reviewRouter)

app.use(errorMiddleware)

app.listen(port, () => {
    connectMongo()
    console.log(`Server is running on port ${port}`)
})