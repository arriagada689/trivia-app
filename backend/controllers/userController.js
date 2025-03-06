import asyncHandler from "express-async-handler"
import bcrypt from 'bcrypt';
import validateUserInput from "../utils/validateUserInput.js"
import generateToken from "../utils/generateToken.js";
import formatTime from '../utils/formatTime.js'
import arraysEqual from "../utils/arraysEqual.js";
import cleanUsers from "../utils/cleanUsers.js";
import db from "../config/db.js";
import favCategory from "../utils/favCategory.js";

// @desc Auth user/set token
// route POST api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    //Try finding user based on user input
    const user = await db('users').where('username', username).first()
    if(!user) {
        res.status(401);
        throw new Error('Invalid username or password')
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid username or password');
    }

    //send user data with auth token
    res.json({
        username: user.username,
        id: user.id,
        token: generateToken(user.id)
    })
})

// @desc Register a user, send user data
// route POST api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, password, confirm_password } = req.body;

    //validate user input
    const inputValidation = validateUserInput(username, password, confirm_password)
    if (!inputValidation.isValid){
        res.status(400)
        throw new Error(inputValidation.error)
    }

    //check if user already exists
    const existingUser = await db('users').where( 'username', username ).first()
    if(existingUser){
        res.status(400)
        throw new Error('Username is already taken')
    }

    //hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //create user
    const newUser = {
        username,
        password: hashedPassword,
        total_games: 0,
        overall_average: '0',
        total_answers_correct: 0,
        total_answers_incorrect: 0,
        played_categories: [],
        longest_score_streak: 0,
        current_score_streak: 0
    }
    await db('users').insert(newUser)

    //respond by sending user data (token included)
    const insertedUser = await db('users').select('id', 'username').where('username', username).first()
    const token = generateToken(insertedUser.id)

    res.json({
        username: insertedUser.username,
        id: insertedUser.id,
        token: token
    })
})

// @desc Save Game data when a user is logged in
// route POST api/users/post_game
// @access Private
const postGame = asyncHandler(async (req, res) => {
    const user = await db('users').where('id', req.user.id).first()
    const data = req.body

    //update user profile data based on game data

    //math for average calculation
    const user_total_answers_correct = Number(user.total_answers_correct) + data.correct_count
    const user_total_answers_incorrect = Number(user.total_answers_incorrect) + data.incorrect_count
    const totalQuestions = user_total_answers_correct + user_total_answers_incorrect 
    const avg = parseFloat((user_total_answers_correct / totalQuestions).toFixed(2));

    //update played_categories array
    const newPlayedCategories = [...user.played_categories, data.category];

    //current and longest score streak
    let scoreStreak
    if(arraysEqual(data.user_input_arr, data.correct_answer_arr)){
        scoreStreak = Number(user.current_score_streak) + 1
    } else {
        scoreStreak = 0
    }

    let longestScoreStreak
    if(scoreStreak > Number(user.longest_score_streak)){
        longestScoreStreak = scoreStreak
    } else {
        longestScoreStreak = Number(user.longest_score_streak)
    }

    //handle achievements
    if(arraysEqual(data.user_input_arr, data.correct_answer_arr)){
        const achievementObj = {
            name: 'Trivia Master',
            description: 'Achieve a perfect score',
            user_id: user.id
        }
        await db('achievements').insert(achievementObj)

        if(scoreStreak === 3){
            const wizardObj = {
                name: 'Trivia Wizard',
                description: 'Achieve a 3-game perfect score streak',
                user_id: user.id
            }
            await db('achievements').insert(wizardObj)
        } else if(scoreStreak === 5){
            const specialistObj = {
                name: 'Trivia Specialist',
                description: 'Achieve a 5-game perfect score streak',
                user_id: user.id
            }
            await db('achievements').insert(specialistObj)
        } else if(scoreStreak === 10){
            const geniusObj = {
                name: 'Trivia Genius',
                description: 'Achieve a 10-game perfect score streak',
                user_id: user.id
            }
            await db('achievements').insert(geniusObj)
        } else if (scoreStreak === 20) {
            const kingObj = {
                name: 'Trivia King',
                description: 'Achieve a 20-game perfect score streak',
                user_id: user.id
            }
            await db('achievements').insert(kingObj)
        }
    }

    await db('users')
        .where('id', req.user.id)
        .update({
            total_games: Number(user.total_games) + 1,
            overall_average: avg,
            total_answers_correct: user_total_answers_correct,
            total_answers_incorrect: user_total_answers_incorrect,
            played_categories: newPlayedCategories,
            longest_score_streak: longestScoreStreak,
            current_score_streak: scoreStreak
        })

    // Prepare the data for game table insertion
    const gameData = {
        user_id: user.id,
        correct_count: data.correct_count,
        incorrect_count: data.incorrect_count,
        time_taken: data.time_taken === 0 ? '00:01' : formatTime(data.time_taken),
        question_arr: data.question_arr,
        user_input_arr: data.user_input_arr,
        correct_answer_arr: data.correct_answer_arr,
        category: data.category,
        gamemode: data.gamemode
    };

    const [insertedGame] = await db('games').insert(gameData).returning('*')

    if(insertedGame) {
        res.json(insertedGame)
    } else {
        res.status(500).json('Failed to create game')
    }
})

// @desc Get game data based off of param id
// route GET api/users/game_data/:id
// @access Private
const getGameData = asyncHandler (async (req, res) => {
    const gameId = req.params.id;

    const game = await db('games').where('id', gameId).first()

    if(game) {
        res.json(game)
    } else {
        res.status(500).json('Error fetching game data')
    }
})

// @desc Get profile data (stats, achievements, game history)
// route GET api/users/profile
// @access Private
const getProfileData = asyncHandler(async (req, res) => {
    const user = await db('users').where('id', req.user.id).first()

    //grab statistics
    const userObj = user
    userObj['played_categories'] = favCategory(user.played_categories)
    delete userObj.password

    //grab acheivements
    const achievements = await db('achievements').where('user_id', user.id)

    //grab game history
    const gameHistory = await db('games').where('user_id', user.id)

    if(user) {
        res.json({
            stats: userObj,
            achievements: achievements,
            game_history: gameHistory
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const metricId = {
    total_games: 1,
    total_correct: 2,
    total_wrong: 3,
    overall_average: 4,
    current_score_streak: 5,
    longest_score_streak: 6
}
const getLeaderboardData = asyncHandler(async (req, res) => {
    const { metric } = req.query
    let users

    if(metric === '1'){
        users = await db('users').orderBy('total_games', 'desc')
    } else if(metric === '2'){
        users = await db('users').orderBy('total_answers_correct', 'desc')
    } else if(metric === '3'){
        users = await db('users').orderBy('total_answers_incorrect', 'desc')
    } else if(metric === '4'){
        users = await db('users').orderBy('overall_average', 'desc')
    } else if(metric === '5'){
        users = await db('users').orderBy('current_score_streak', 'desc')
    } else if(metric === '6'){
        users = await db('users').orderBy('longest_score_streak', 'desc')
    }
    
    res.json(cleanUsers(users))
})

// @desc Update user username and password
// route PUT api/users/update_profile
// @access Private
const modifyProfile = asyncHandler(async (req, res) => {   
    const { username, password, confirm_password } = req.body
    const user = await db('users').where('id', req.user.id).first()
    const token = req.headers.authorization.split(' ')[1];
    
    const inputValidation = validateUserInput(username, password, confirm_password)
    if (!inputValidation.isValid){
        res.status(400)
        throw new Error(inputValidation.error)
    }

    if(user) {
        //update username
        user['username'] = username
        
        //hash password and update password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user['password'] = hashedPassword

        await db('users').where('id', user.id).update(user)

        res.json({
            username: user.username,
            id: user.id,
            token: token
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc Delete profile and cleanup
// route DELETE api/users/delete_profile
// @access Private
const deleteProfile = asyncHandler(async (req, res) => {
    const data = await db('users').where('id', req.user.id).first().del()
    res.json('Successfully removed user')
})

// @desc Get user data (just stats)
// route GET api/users/user_data
// @access Private
const getUserData = asyncHandler(async (req, res) => {
    const user = await db('users').where('id', req.user.id).first()
    if(user){

        //get favorite category
        user['favorite_category'] = favCategory(user.played_categories)

        //turn user object into array
        const arr = []
        arr.push(user.total_games)
        arr.push(user.overall_average)
        arr.push(user.total_answers_correct)
        arr.push(user.total_answers_incorrect)
        arr.push(user.favorite_category)
        arr.push(user.current_score_streak)
        arr.push(user.longest_score_streak)

        res.json(arr)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const awake = asyncHandler(async (req, res) => {
    res.json('awake')
})

export {
    authUser,
    registerUser,
    postGame,
    getGameData,
    getProfileData,
    getLeaderboardData,
    modifyProfile,
    deleteProfile,
    getUserData,
    awake
}