import express from 'express';
import bodyParser from 'body-parser';
import db from './config/db.js';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();

import userRoutes from './routes/userRoutes.js'
import triviaRoutes from './routes/triviaRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());

app.use('/api/users', userRoutes)
app.use('/api/trivia', triviaRoutes)

app.get('/', async (req, res) => {
    res.send('server is ready')
})

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})