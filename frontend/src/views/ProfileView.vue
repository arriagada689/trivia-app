<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, RouterLink } from 'vue-router';
import formatAsPercentage from '@/utils/formatAsPercentage';
import formatDate from '@/utils/formatDate';

const authStore = useAuthStore()
const router = useRouter()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const token = JSON.parse(localStorage.getItem('userInfo')).token

const stats = ref(null)
const achievements = ref(null)
const gameHistory = ref(null)
const loading = ref(true)
const limit = ref(5)

const username = JSON.parse(localStorage.getItem('userInfo')).username

onMounted(async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/users/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if(response.ok){
            const data = await response.json()
            stats.value = data.stats
            achievements.value = data.achievements
            gameHistory.value = data.game_history
            loading.value = false
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        console.error(error.message)
    }
})

const deleteProfile = async () => {
    const confirm = window.confirm('Are you sure you want to delete your profile?')
    if(!confirm) return

    try {
        const response = await fetch(`${apiBaseUrl}/users/delete_profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            await response.json()
            authStore.logout()
            router.push('/')
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        console.error(error.message)
    }
}

const handleClick = (command) => {
    if(command === 'more'){
        limit.value = limit.value + 5
    } else {
        limit.value = limit.value - 5
    }
}
</script>

<template>
    <div v-if="loading" class="flex items-center justify-center min-h-[calc(90vh-65px)]">
        <i class="pi pi-spinner animate-spin text-7xl"></i>
    </div>

    <div v-else>
        <div class="flex flex-col md:flex-row items-center md:justify-between mb-4 md:mb-0">
            <div class="space-x-6 py-7">
                <div class="relative inline-block md:ml-2">
                    <i class="pi pi-user text-3xl relative"></i>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="border-2 border-black rounded-full h-[50px] w-[50px] flex-shrink-0"></div>
                    </div>
                </div>
                <span class="text-3xl font-bold">{{ username }}</span>
            </div>

            <div class="space-x-3 flex">
                <button @click="deleteProfile" class="bg-red-500 hover:bg-red-400 text-white rounded-md px-2 py-1 cursor-pointer active:scale-[98%] font-semibold"><i class="pi pi-trash mr-2"></i>Delete Profile</button>
                <RouterLink to="/profile/update" class="bg-green-500 hover:bg-green-400 text-white rounded-md px-2 py-1 cursor-pointer active:scale-[98%] font-semibold"><i class="pi pi-user-edit mr-2"></i>Update Profile</RouterLink>
            </div>
        </div>
        
        <div class="flex flex-wrap justify-around xl:justify-between gap-5 mx-4 md:mx-0">
            <div class="w-full md:w-[400px] bg-white shadow-xl rounded-md p-2 h-fit">
                <div class="text-center font-semibold text-lg"><i class="pi pi-chart-line mr-2"></i>Statistics</div>
                <div>Total Games: <span class="text-purple-600">{{ stats.total_games }}</span></div>
                <div>Overall Average: <span class="text-purple-600">{{ formatAsPercentage(stats.overall_average) }}</span></div>
                <div>Total Answers Correct: <span class="text-purple-600">{{ stats.total_answers_correct }}</span></div>
                <div>Total Answers Incorrect: <span class="text-purple-600">{{ stats.total_answers_incorrect }}</span></div>
                <div>Most Played Category: <span class="text-purple-600">{{ stats.played_categories }}</span></div>
                <div>Current Perfect Score Streak: <span class="text-purple-600">{{ stats.current_score_streak }}</span></div>
                <div>Longest Perfect Score Streak: <span class="text-purple-600">{{ stats.longest_score_streak }}</span></div>
            </div>

            <div class="w-full md:w-[400px] bg-white shadow-xl rounded-md p-2 h-fit">
                <div class="text-center font-semibold text-lg"><i class="pi pi-trophy mr-2"></i>Achievements</div>
                <div v-if="achievements.length > 0">
                    <div v-for="(achievement, index) of achievements" :key="index" class="border-b py-1 space-y-1">
                        <div class="font-medium text-purple-600">{{ achievement.name }}</div>
                        <div>{{ achievement.description }}</div>
                        <div><i class="pi pi-calendar mr-2"></i>{{ formatDate(achievement.created_at) }}</div>
                    </div>
                </div>
                <div v-else class="flex items-center justify-center h-[60px] border rounded-md mt-1">No achievements to display...</div>
            </div>

            <div class="w-full md:w-[400px] bg-white shadow-xl rounded-md p-2 h-fit">
                <div class="text-center font-semibold text-lg"><i class="pi pi-history mr-2"></i>Game History</div>
                <div v-if="gameHistory.length > 0">
                    <RouterLink :to="`/results/${game.id}`" v-for="(game, index) of gameHistory.slice(0, limit)" :key="index" class="flex items-center gap-x-3 border-b py-1 hover:bg-gray-100">
                        <div class='flex flex-col items-center'>
                            <div class='text-sm'>Score:</div> 
                            <div class='text-xl font-bold'>{{ game.correct_count }}/{{ game.question_arr.length }}</div>
                        </div>
                        <div>
                            <div>Category: <span className='text-secondary'>{{ game.category }}</span></div>
                            <div>Time Taken: <span className='text-secondary'>{{ game.time_taken }}</span></div>
                            <div>Gamemode: <span className='text-secondary'>{{ game.gamemode }}</span></div>
                            <div><i class="pi pi-calendar mr-2"></i>{{ formatDate(game.created_at) }}</div>
                        </div>
                    </RouterLink>
                </div>
                <div v-else class="flex items-center justify-center h-[60px] border rounded-md mt-1">No games to display...</div>
                <div class="flex justify-between my-1">
                    <button @click="handleClick('more')" v-if="gameHistory.length > limit" class="text-blue-500 hover:underline">More</button>
                    <button @click="handleClick('less')" v-if="limit > 5" class="text-blue-500 hover:underline">Less</button>
                </div>
            </div>

            
        </div> 
        
    </div>
</template>