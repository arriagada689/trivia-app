import express from 'express'
import {
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
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/auth', authUser)
router.post('/register', registerUser)
router.route('/post_game').post(protect, postGame)
router.route('/game_data/:id').get(protect, getGameData)
router.route('/profile').get(protect, getProfileData)
router.route('/user_data').get(protect, getUserData)
router.route('/update_profile').put(protect, modifyProfile)
router.route('/delete_profile').delete(protect, deleteProfile)
router.get('/leaderboard', getLeaderboardData)
router.get('/awake', awake)

export default router