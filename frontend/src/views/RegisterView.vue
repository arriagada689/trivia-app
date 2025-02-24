<script setup>
import { useAuthStore } from '@/stores/authStore';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
    username: '',
    password: '',
    confirm_password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
    try {
        loading.value = true
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        const response = await fetch(`${apiBaseUrl}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        if(response.ok){
            const data = await response.json()
            authStore.login(data)
            router.push('/')
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        errorMessage.value = error.message
        console.error(error.message)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div v-if="loading">Loading</div>

    <div v-else>
        <div v-if="errorMessage.length > 0">{{ errorMessage }}</div>

        <form @submit.prevent="handleRegister">
            <div>
                <label for="username">Username:</label>
                <input class="border" id="username" v-model="form.username" type="text" required>
            </div>

            <div>
                <label for="password">Password:</label>
                <input class="border" id="password" v-model="form.password" type="text" required>
            </div>

            <div>
                <label for="confirm_password">Confirm Password:</label>
                <input class="border" id="confirm_password" v-model="form.confirm_password" type="text" required>
            </div>

            <button type="submit">Register</button>
        </form>
    </div>
</template>