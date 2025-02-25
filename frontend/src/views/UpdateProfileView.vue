<script setup>
import { useAuthStore } from '@/stores/authStore';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const token = JSON.parse(localStorage.getItem('userInfo')).token
const username = JSON.parse(localStorage.getItem('userInfo')).username

const form = reactive({
    username: username,
    password: '',
    confirm_password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const submitHandler = async () => {
    try {
        loading.value = true
        const response = await fetch(`${apiBaseUrl}/users/update_profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })
        if(response.ok) {
            const data = await response.json()
            authStore.login(data)
            router.push('/profile')
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

        <form @submit.prevent="submitHandler">
            <div>
                <label for="username">Username:</label>
                <input class="border" id="username" v-model="form.username" type="text" required>
            </div>

            <div>
                <label for="password">Password:</label>
                <input class="border" id="password" v-model="form.password" type="password" required>
            </div>

            <div>
                <label for="confirm_password">Confirm Password:</label>
                <input class="border" id="confirm_password" v-model="form.confirm_password" type="password" required>
            </div>

            <button type="submit">Update</button>
        </form>
    </div>
</template>