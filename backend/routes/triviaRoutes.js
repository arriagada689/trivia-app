import express from 'express'
import {
    getAmount,
    getCategories,
    getQuestions
} from '../controllers/triviaController.js'

const router = express.Router();

router.get('/categories', getCategories)
router.get('/amount', getAmount)
router.get('/questions', getQuestions)

export default router