<script setup>
import formatAsPercentage from '@/utils/formatAsPercentage';
import { ref, watchEffect } from 'vue';

const metric = ref('1')
const userData = ref(null)
const loading = ref(false)

const username = JSON.parse(localStorage.getItem('userInfo'))?.username || ''

watchEffect(async () => {
    try {
        loading.value = true
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        const response = await fetch(`${apiBaseUrl}/users/leaderboard?metric=${metric.value}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok){
                const data = await response.json()
                userData.value = data
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
    } catch (error) {
        console.error(error.message)
    } finally {
        loading.value = false
    }
})

const updateMetric = (newMetric) => {
    metric.value = newMetric
}
</script>

<template>
    <div v-if="loading" class="flex items-center justify-center min-h-[calc(90vh-65px)]">
        <i class="pi pi-spinner animate-spin text-7xl text-purple-600"></i>
    </div>

    <div v-else class="space-y-5 mt-3 mx-3 md:mx-0">
        <div class="text-center text-3xl font-semibold">Leaderboard</div>

        <div class="flex flex-wrap justify-center items-center gap-3">
            <div>Sorting Metric:</div>
            <button :class="`${metric === '1' ? 'bg-purple-800' : 'bg-purple-600'} text-white hover:bg-purple-500 rounded-md px-2`" @click="updateMetric('1')">Total Games</button>
            <button :class="`${metric === '6' ? 'bg-purple-800' : 'bg-purple-600'} text-white hover:bg-purple-500 rounded-md px-2`" @click="updateMetric('6')">Longest Score Streak</button>
            <button :class="`${metric === '5' ? 'bg-purple-800' : 'bg-purple-600'} hidden sm:block bg-purple-600 text-white hover:bg-purple-500 rounded-md px-2`" @click="updateMetric('5')">Current Score Streak</button>
            <button :class="`${metric === '4' ? 'bg-purple-800' : 'bg-purple-600'} text-white hover:bg-purple-500 rounded-md px-2`" @click="updateMetric('4')">Overall Average</button>
            <button :class="`${metric === '2' ? 'bg-purple-800' : 'bg-purple-600'} hidden md:block bg-purple-600 text-white hover:bg-purple-500 rounded-md px-2`" @click="updateMetric('2')">Total Answers Correct</button>
            <button :class="`${metric === '3' ? 'bg-purple-800' : 'bg-purple-600'} hidden lg:block bg-purple-600 text-white hover:bg-purple-500 rounded-md px-2`" @click="updateMetric('3')">Total Answers Incorrect</button>
        </div>

        <div class="rounded-md bg-white shadow-xl">
            <!--Header section-->
            <div class="flex items-center gap-x-4 bg-gray-500 text-white rounded-t-md p-1 text-center">
                <div class="w-[30px] sm:w-1/6 md:w-1/7 lg:w-1/8 ">Rank</div>
                <div class="flex-grow sm:w-1/6 md:w-1/7 lg:w-1/8 text-start">Username</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8">Total Games</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8">Longest Score Streak</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8 hidden sm:block">Current Score Streak</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8">Overall Average</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8 hidden md:block">Total Answers Correct</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8 hidden lg:block">Total Answers Incorrect</div>
            </div>

            <div v-for="(user, index) of userData" class="flex items-center gap-x-4 p-1 text-center" :key="index">
                <div class="w-[30px] sm:w-1/6 md:w-1/7 lg:w-1/8">{{ index + 1 }}</div>
                <div :class="`flex-grow sm:w-1/6 md:w-1/7 lg:w-1/8 truncate text-start ${username === user.username ? 'font-semibold' : ''}`">{{ user.username }}<i v-if="username === user.username" class="pi pi-star-fill ml-2"></i></div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8">{{ user.total_games }}</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8">{{ user.longest_score_streak }}</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8 hidden sm:block">{{ user.current_score_streak }}</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8">{{ formatAsPercentage(user.overall_average) }}</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8 hidden md:block">{{ user.total_answers_correct }}</div>
                <div class="w-1/5 sm:w-1/6 md:w-1/7 lg:w-1/8 hidden lg:block">{{ user.total_answers_incorrect }}</div>
            </div>
        </div>

    </div>
</template>