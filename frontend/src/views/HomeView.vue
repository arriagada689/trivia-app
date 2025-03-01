<script setup>
import { ref, watchEffect, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { triviaCategories } from '@/data/categories';
import AchievementTable from '@/components/AchievementTable.vue';

const router = useRouter();

const category = ref(0)
const difficulty = ref('any')
const limit = ref(50)
const amount = ref(1)
const gamemode = ref('Normal')
const timeLimit = ref(10)
const categories = triviaCategories

const userData = ref(null)
const index = ref(0)

const handleStart = () => {
    if(gamemode.value === 'Normal'){
        router.push(`/questions?category=${category.value}&difficulty=${difficulty.value}&amount=${amount.value}`)
    } else {
        router.push(`/timed_questions?category=${category.value}&difficulty=${difficulty.value}&amount=${amount.value}`)
    }
}

//handles time limit
watchEffect(() => {
    sessionStorage.setItem('time_limit', timeLimit.value)
})

//handles dynamic limit
watch([category, difficulty], async () => {
    if(category.value !== 0){
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
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
})

</script>

<template>
    
    <div class="flex flex-col-reverse md:grid grid-cols-2 md:gap-x-3 gap-y-6 mt-6 mx-3 md:mx-0">
        <div class="flex flex-col justify-center h-fit md:h-[384px] gap-y-4">
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
        <div className='space-y-3 bg-white rounded-md shadow-xl p-3'>

            <!--Category dropdown-->
            <div className='text-center text-2xl font-medium'>Select <span className='text-purple-600'>Category</span></div>
            <select name="categories" id="categories" v-model="category" className='w-full text-center border border-black p-1 text-lg rounded-md'>
                <option :value="0">Any Category</option>
                <option v-for="category of categories" :value="category['id']" :key="category['id']">{{ category['name'] }}</option>
            </select>

            <!--Difficulty dropdown-->
            <div className='space-y-2'>
                <div className='text-center text-2xl font-medium'>Select <span className='text-purple-600'>Difficulty</span></div>
                <select name="difficulty" id="difficulty" v-model="difficulty" className='w-full text-center border border-black p-1 text-lg rounded-md'>
                <option :value="'any'">Any Difficulty</option>
                <option :value="'easy'">Easy</option>
                <option :value="'medium'">Medium</option>
                <option :value="'hard'">Hard</option>
                </select>
            </div>

            <!--Amount dropdown-->
            <div className='space-y-2'>
                <div className='text-center text-2xl font-medium'>Select <span className='text-purple-600'>Amount</span></div>
                <select name="amount" id="amount" v-model="amount" className='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option v-for="(num, index) of new Array(limit).fill(1)" :value="index + 1" :key="index">{{ index + 1 }}</option>
                </select>
            </div>

            <!--Gamemode dropdown-->
            <div className='space-y-2'>
                <div className='text-center text-2xl font-medium'>Select <span className='text-purple-600'>Game Mode</span></div>
                <select name="gamemode" id="gamemode" v-model="gamemode" className='w-full text-center border border-black p-1 text-lg rounded-md'>
                    <option :value="'Normal'">Normal</option>
                    <option :value="'Timed'">Timed</option>
                </select>
            </div>

            <!--Time limit dropdown-->
            <div v-if="gamemode === 'Timed'" class="space-y-2">
                <div className='text-center text-2xl font-medium'>Select <span className='text-purple-600'>Time Limit</span></div>
                <select name="time-limir" id="time-limit" v-model="timeLimit" className='w-full text-center border border-black p-1 text-lg rounded-md'>
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