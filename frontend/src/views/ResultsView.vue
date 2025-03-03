<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import formatTime from '@/utils/formatTime';
import formatAsPercentage from '@/utils/formatAsPercentage';

const route = useRoute()
const router = useRouter()
const { id } = route.params
const resultData = ref(null)
const loading = ref(true)
const isLoggedIn = ref(null)

onMounted(async () => {
    if(!sessionStorage.getItem('resultData') && !localStorage.getItem('userInfo')) {
        router.push('/not_found')
    }
    
    if(localStorage.getItem('userInfo')){
        try {
            isLoggedIn.value = true
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/users/game_data/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if(response.ok){
                const data = await response.json()
                resultData.value = data
                loading.value = false
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error.message)
            router.push('/error')
        } 
    } else {
        isLoggedIn.value = false
        resultData.value = JSON.parse(sessionStorage.getItem('resultData'))
    }
    loading.value = false
})

const gamemodeColor = () => {
    if(resultData.gamemode === 'easy'){
        return 'text-green-500'
    } else if(resultData.gamemode === 'medium'){
        return 'text-orange-500'
    } else {
        return 'text-red-500'
    }
}
</script>

<template>
    <div v-if="loading" class="flex items-center justify-center min-h-[calc(90vh-65px)]">
        <i class="pi pi-spinner animate-spin text-7xl"></i>
    </div>

    <div v-else class="flex flex-col justify-center text-center gap-y-4 mt-3 mx-3 md:mx-0 pb-3">
        <div class="flex items-center justify-center gap-x-3">
            <span class="text-xl md:text-3xl font-semibold">Results: <span class="text-purple-600">{{ resultData.correct_count }}/{{ resultData.question_arr.length }}</span></span>
            <span class="text-lg md:text-2xl">Time: <span class="text-purple-600">{{ resultData.time_taken }}</span></span>
            <span class="text-lg md:text-2xl">Game mode: <span :class="gamemodeColor()">{{ resultData.gamemode }}</span></span>
        </div>
        <div class="text-3xl font-semibold text-green-500">{{ formatAsPercentage(resultData.correct_count / resultData.question_arr.length) }}</div>

        <div class="space-y-3 md:w-[80%] mx-auto">
            <div v-for="(question, index) of resultData.question_arr" class="bg-white rounded-md p-3 text-lg space-y-1">
                <div class="font-semibold">Question <span>{{ index + 1 }}</span></div>
                <div>{{ question }}</div>
                <div v-if="resultData.correct_answer_arr[index] === resultData.user_input_arr[index]" class="bg-green-500 rounded-md text-white font-semibold p-1">
                    Correct: {{ resultData.correct_answer_arr[index] }}
                </div>
                <div v-else-if="resultData.user_input_arr[index] === 'Ran out of time!'" class="bg-red-500 rounded-md text-white font-semibold p-1">
                    No answer: Ran out of time!
                </div>
                <div v-else class="space-y-2">
                    <div class="bg-red-500 rounded-md text-white font-semibold p-1">Your answer: {{ resultData.user_input_arr[index] }}</div>
                    <div class="bg-green-500 rounded-md text-white font-semibold p-1">Correct answer: {{ resultData.correct_answer_arr[index] }}</div>
                </div>
            </div>
        </div>

        <div class="flex justify-center gap-x-2">
            <RouterLink class="bg-purple-600 hover:bg-purple-500 w-fit text-white font-semibold cursor-pointer px-2 py-1 rounded-md active:scale-[98%] text-lg" to="/">Play Again</RouterLink>
            <RouterLink v-if="isLoggedIn" class="border-2 border-black text-black hover:bg-gray-100 w-fit  font-semibold cursor-pointer px-2 py-1 rounded-md active:scale-[98%] text-lg" to="/profile">Profile</RouterLink>
        </div>
    </div>
</template>