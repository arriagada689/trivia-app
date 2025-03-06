import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url'
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', "index.html"));
    });
} else {
    app.get('/', (req, res) => {
        res.send('server is ready')
    })
}

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})