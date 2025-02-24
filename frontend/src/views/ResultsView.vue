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

onMounted(async () => {
    if(!sessionStorage.getItem('resultData') && !localStorage.getItem('userInfo')) {
        router.push('/not_found')
    }
    
    if(localStorage.getItem('userInfo')){
        try {
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
        resultData.value = JSON.parse(sessionStorage.getItem('resultData'))
        console.log(resultData.value);
    }
    loading.value = false
})

</script>

<template>
    <div v-if="loading">Loading</div>

    <div v-else>
        <div>Results:</div>
        <div>{{ resultData.correct_count }}/{{ resultData.question_arr.length }}</div>
        <div>Time: <span>{{ resultData.time_taken }}</span></div>
        <div>Game mode: <span>{{ resultData.gamemode }}</span></div>
        <div>{{ formatAsPercentage(resultData.correct_count / resultData.question_arr.length) }}</div>

        <div class="space-y-3">
            <div v-for="(question, index) of resultData.question_arr">
                <div>Question <span>{{ index + 1 }}</span></div>
                <div>{{ question }}</div>
                <div v-if="resultData.correct_answer_arr[index] === resultData.user_input_arr[index]" class="bg-green-500">
                    Correct: {{ resultData.correct_answer_arr[index] }}
                </div>
                <div v-else-if="resultData.user_input_arr[index] === 'Ran out of time!'" class="bg-red-500">
                    No answer: Ran out of time!
                </div>
                <div v-else class="space-y-2">
                    <div class="bg-red-500">Your answer: {{ resultData.user_input_arr[index] }}</div>
                    <div class="bg-green-500">Correct answer: {{ resultData.correct_answer_arr[index] }}</div>
                </div>
            </div>
        </div>

        <div class="flex gap-x-2">
            <RouterLink to="/">Play Again</RouterLink>
            <RouterLink to="/profile">Profile</RouterLink>
        </div>
    </div>
</template>