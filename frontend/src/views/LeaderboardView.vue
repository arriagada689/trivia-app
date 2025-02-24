<script setup>
import { ref, watchEffect } from 'vue';

const metric = ref('1')
const userData = ref(null)
const loading = ref(false)

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
                console.log(data);
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
    <div v-if="loading">Loading</div>

    <div v-else>
        <div class="space-x-3">
            <button @click="updateMetric('1')">Total Games</button>
            <button @click="updateMetric('2')">Total Correct</button>
            <button @click="updateMetric('3')">Total Wrong</button>
            <button @click="updateMetric('4')">Overall Average</button>
            <button @click="updateMetric('5')">Current Perfect Score</button>
            <button @click="updateMetric('6')">Longest Perfect Score Streak</button>
        </div>

    </div>
</template>