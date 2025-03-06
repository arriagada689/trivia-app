<script setup>
import { ref, watchEffect, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { triviaCategories } from '@/data/categories';
import AchievementTable from '@/components/AchievementTable.vue';
import MiniProfile from '@/components/MiniProfile.vue';
import { useAuthStore } from '@/stores/authStore';
const authStore = useAuthStore()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const router = useRouter();

const category = ref(0)
const difficulty = ref('any')
const limit = ref(50)
const amount = ref(1)
const gamemode = ref('Normal')
const timeLimit = ref(10)
const categories = triviaCategories

const displayCategory = ref(null)
const displayDifficulty = ref(null)

const handleStart = () => {
    if(gamemode.value === 'Normal'){
        router.push(`/questions?category=${category.value}&difficulty=${difficulty.value}&amount=${amount.value}`)
    } else {
        router.push(`/timed_questions?category=${category.value}&difficulty=${difficulty.value}&amount=${amount.value}`)
    }
}

const randomizeClick = async () => {
    //cycle through and set category
    let interval = setInterval(() => {
        displayCategory.value = triviaCategories[Math.floor(Math.random() * triviaCategories.length)].name;
    }, 150)
    setTimeout(() => {
        clearInterval(interval)
        category.value = triviaCategories[Math.floor(Math.random() * triviaCategories.length)].id;
        displayCategory.value = null
    }, 1000)

    //cycle through and set difficulty
    const difficulties = ['any', 'easy', 'medium', 'hard']
    const displayDifficulties = ['Any', 'Easy', 'Medium', 'Hard']
    let interval2 = setInterval(() => {
        displayDifficulty.value = displayDifficulties[Math.floor(Math.random() * displayDifficulties.length)]
    }, 150)
    setTimeout(() => {
        clearInterval(interval2)
        difficulty.value = difficulties[Math.floor(Math.random() * difficulties.length)]
        displayDifficulty.value = null
    }, 1000)

    //get new limit and cycle through and set amount
    await getNewLimit()
    let interval3 = setInterval(() => {
        amount.value = Math.floor(Math.random() * limit.value) + 1
    }, 150)
    setTimeout(() => {
        clearInterval(interval3)
    }, 1000)

    const gamemodes = ['Normal', 'Timed']
    gamemode.value = gamemodes[Math.floor(Math.random() * gamemodes.length)]
    
    if(gamemode.value === 'Timed'){
        const timeLimits = [5, 10, 15]
        timeLimit.value = timeLimits[Math.floor(Math.random() * timeLimits.length)]
    }
}

//handles time limit
watchEffect(() => {
    sessionStorage.setItem('time_limit', timeLimit.value)
})

//handles dynamic limit
watch([category, difficulty], async () => {
    await getNewLimit()
})

const getNewLimit = async () => {
    if(category.value !== 0){
        try {
            const response = await fetch(`${apiBaseUrl}/trivia/amount?categoryId=${category.value}&difficulty=${difficulty.value}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                limit.value = data.amount
                if(amount.value > limit.value) {
                    amount.value = 1
                }
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error.message)
        }
    }
}

</script>

<template>
    
    <div class="flex flex-col-reverse md:grid grid-cols-2 md:gap-x-3 gap-y-6 mt-6 mx-3 md:mx-0">
        <MiniProfile v-if="authStore.isLoggedIn" />
        <div v-else class="flex flex-col justify-center h-fit md:h-[384px] gap-y-4 border-b md:border-none pb-3 md:pb-0">
            <div class="font-bold text-2xl">Creating an account will keep track of your....</div>
            <div class="space-y-2">
                <div><i class="pi pi-chart-line mr-3 text-3xl"></i> <span class="">Game statistics (including total games, overall average, perfect game streaks and more)</span></div>
                <div><i class="pi pi-history mr-3 text-3xl"></i> Game History</div>
                <div><i class="pi pi-trophy mr-3 text-3xl"></i> Achievements</div>
            </div>
            <div class="flex justify-center gap-x-4">
                <RouterLink to="/register" class="bg-purple-600 hover:bg-purple-500 w-fit py-1 px-3 text-white font-semibold cursor-pointer rounded-md active:scale-[98%] text-lg">Register</RouterLink>
                <RouterLink to="/login" class="border-2 border-black hover:bg-gray-300 w-fit py-1 px-3 text-black font-semibold cursor-pointer rounded-md active:scale-[98%] text-lg">Login</RouterLink>
            </div>
        </div>

        <!--Prompt Section-->
        <div className='space-y-3 bg-white rounded-md shadow-xl p-3 relative text-center'>
            <button 
                class="lg:absolute left-3 top-3 bg-gray-300 hover:bg-gray-200 inline-flex items-center px-2 py-1 rounded-md cursor-pointer active:scale-[98%]"
                @click="randomizeClick">
                Randomize 
                <i class="pi pi-sync ml-1"></i>
            </button>

            <!--Category dropdown-->
            <div class="space-y-2">
                <div className='text-center text-2xl font-medium'>Select <span class='text-purple-600'>Category</span></div>
                <select v-if="displayCategory" class='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option>{{ displayCategory }}</option>
                </select>
                <select v-else name="categories" id="categories" v-model="category" class='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option :value="0">Any Category</option>
                    <option v-for="category of categories" :value="category['id']" :key="category['id']">{{ category['name'] }}</option>
                </select>
            </div>

            <!--Difficulty dropdown-->
            <div class='space-y-2'>
                <div class='text-center text-2xl font-medium'>Select <span class='text-purple-600'>Difficulty</span></div>
                <select v-if="displayDifficulty" class='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option>{{ displayDifficulty }}</option>
                </select>
                <select v-else name="difficulty" id="difficulty" v-model="difficulty" class='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option :value="'any'">Any Difficulty</option>
                    <option :value="'easy'">Easy</option>
                    <option :value="'medium'">Medium</option>
                    <option :value="'hard'">Hard</option>
                </select>
            </div>

            <!--Amount dropdown-->
            <div class='space-y-2'>
                <div class='text-center text-2xl font-medium'>Select <span class='text-purple-600'>Amount</span></div>
                <select name="amount" id="amount" v-model="amount" class='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option v-for="(num, index) of new Array(limit).fill(1)" :value="index + 1" :key="index">{{ index + 1 }}</option>
                </select>
            </div>

            <!--Gamemode dropdown-->
            <div class='space-y-2'>
                <div class='text-center text-2xl font-medium'>Select <span class='text-purple-600'>Game Mode</span></div>
                <select name="gamemode" id="gamemode" v-model="gamemode" class='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option :value="'Normal'">Normal</option>
                    <option :value="'Timed'">Timed</option>
                </select>
            </div>

            <!--Time limit dropdown-->
            <div v-if="gamemode === 'Timed'" class="space-y-2">
                <div class='text-center text-2xl font-medium'>Select <span class='text-purple-600'>Time Limit</span></div>
                <select name="time-limit" id="time-limit" v-model="timeLimit" class='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="15">15</option>
                </select>
            </div>

            <div class="text-center">
                <button @click="handleStart" class="bg-purple-600 hover:bg-purple-500 w-fit py-1 px-3 text-white font-semibold cursor-pointer rounded-md active:scale-[98%] text-lg">Start Game</button>
            </div>
        </div>

        
    </div>

    <AchievementTable />

</template>