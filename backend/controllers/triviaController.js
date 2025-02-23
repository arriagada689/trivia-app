import asyncHandler from "express-async-handler"
import shuffleArray from "../utils/shuffleArray.js"

const triviaUrl = 'https://opentdb.com'

// @desc Get trivia db categories
// route GET api/trivia/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
    const response = await fetch(`${triviaUrl}/api_category.php`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        res.json(data.trivia_categories)
    }
})

// @desc Get amount of possible questions user can choose
// route GET api/trivia/amount
// @access Public
const getAmount = asyncHandler(async (req, res) => {
    const { categoryId, difficulty } = req.query
    
    const response = await fetch(`${triviaUrl}/api_count.php?category=${categoryId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        if(difficulty === 'any'){
            let num = data.category_question_count.total_question_count
            if(num >= 50){
                num = 50
            }
            res.json({amount: num})
        } else if(difficulty === 'easy'){
            let num = data.category_question_count.total_easy_question_count
            if(num >= 50){
                num = 50
            }
            res.json({amount: num})
        } else if(difficulty === 'medium'){
            let num = data.category_question_count.total_medium_question_count
            if(num >= 50){
                num = 50
            }
            res.json({amount: num})
        } else if(difficulty === 'hard'){
            let num = data.category_question_count.total_hard_question_count
            if(num >= 50){
                num = 50
            }
            res.json({amount: num})
        }
    } else {
        res.status(400).json('Error')
    }
})

// @desc Get trivia questions based on user parameters
// route GET api/trivia/questions
// @access Public
const getQuestions = asyncHandler(async (req, res) => {
    const { category, difficulty, amount } = req.query
    // console.log(category, difficulty, amount)
    let trivia_base_url = triviaUrl + `/api.php?amount=${amount}&encode=url3986`
    if(category !== 0){
        trivia_base_url += `&category=${category}`
    }
    if(difficulty !== 'any'){
        trivia_base_url += `&difficulty=${difficulty}`
    }
    const response = await fetch(`${trivia_base_url}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        const arr = []

        //clean up data (decoding, set up randomized options and answer array)
        for(const item of data.results){
            const temp = {}
            temp['category'] = decodeURIComponent(item.category)
            temp['type'] = decodeURIComponent(item.type)
            temp['difficulty'] = item.difficulty
            temp['question'] = decodeURIComponent(item.question)
            temp['correct_answer'] = decodeURIComponent(item.correct_answer)

            //combine correct and wrong answers, shuffle array and decode each option
            item.incorrect_answers.push(item.correct_answer)
            const decodedAnswers = item.incorrect_answers.map(answer => decodeURIComponent(answer));
            const shuffledOptions = shuffleArray(decodedAnswers);
            temp['options'] = shuffledOptions

            arr.push(temp)
        }

        res.json(arr)
    } else {
        const error = await response.json()
        // console.log(error)
        res.status(400).json('Error')
    }
})

export {
    getCategories,
    getAmount,
    getQuestions,
}