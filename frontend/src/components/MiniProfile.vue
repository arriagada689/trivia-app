<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import formatAsPercentage from '@/utils/formatAsPercentage'
const userData = ref(null)
const index = ref(0)
const loading = ref(true)
const username = JSON.parse(localStorage.getItem('userInfo')).username

onMounted(async () => {
    if(localStorage.getItem('userInfo')){
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/users/user_data`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if(response.ok){
                const data = await response.json()
                userData.value = data
                loading.value = false
            }
        } catch (error) {
            console.error(error.message)
        }
    }
})

const handleNextClick = () => {
    if(index.value + 1 === 7){
        index.value = 0
    } else {
        index.value = index.value + 1
    }
}
</script>

<template>
    <div v-if="loading" class="flex items-center justify-center h-fit md:h-[384px] border-b md:border-none pb-3 md:pb-0">
        <i class="pi pi-spinner animate-spin text-7xl"></i>
    </div>
    <div v-else class="flex flex-col justify-center items-center h-fit md:h-[384px] gap-y-5 border-b md:border-none pb-3 md:pb-0">
        <div class="space-x-6">
            <div class="relative inline-block">
                <i class="pi pi-user text-3xl relative"></i>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="border-2 border-black rounded-full h-[50px] w-[50px] flex-shrink-0"></div>
                </div>
            </div>
            <span class="text-3xl font-bold">{{ username }}</span>
        </div>
        <div class="flex justify-between items-center gap-x-3 bg-white p-2 rounded-md shadow-xl">
            <div class="text-lg font-semibold w-[255px]">
                <div v-if="index === 0">Total Games: <span class="text-purple-600">{{ userData[index] }}</span></div>
                <div v-if="index === 1">Overall Average: <span class="text-purple-600">{{ formatAsPercentage(userData[index]) }}</span></div>
                <div v-if="index === 2">Total Answers Correct: <span class="text-purple-600">{{ userData[index] }}</span></div>
                <div v-if="index === 3">Total Answers Incorrect: <span class="text-purple-600">{{ userData[index] }}</span></div>
                <div v-if="index === 4">Most Played Category: <span class="text-purple-600">{{ userData[index] }}</span></div>
                <div v-if="index === 5">Current Perfect Score Streak: <span class="text-purple-600">{{ userData[index] }}</span></div>
                <div v-if="index === 6">Longest Perfect Score Streak: <span class="text-purple-600">{{ userData[index] }}</span></div>
            </div>

            <button @click="handleNextClick" class="bg-purple-600 text-white hover:bg-purple-500 rounded-md px-3 text-lg"><i class="pi pi-arrow-right"></i></button>
        </div>

        <RouterLink to="/profile" class="bg-gray-400 hover:bg-gray-300 inline-flex items-center px-2 py-1 rounded-md cursor-pointer active:scale-[98%] font-semibold">See Full Profile</RouterLink>
    </div>
</template>