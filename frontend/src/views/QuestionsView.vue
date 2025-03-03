<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import formatTime from '@/utils/formatTime';
import { triviaCategories } from '@/data/categories.js';
import getCategory from '@/utils/getCategory.js';

const route = useRoute(); 
const router = useRouter()
const { category, difficulty, amount } = route.query

const questions = ref(null)
const index = ref(0)
const time = ref(0)
const selectedOption = ref('')
const questionArr = ref([])
const userInputArr = ref([])
const correctAnswerArr = ref([])
const correctCount = ref(0)
const incorrectCount= ref(0)
const loading = ref(true)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

onMounted(async () => {
    try {
        validateQueryParams()
        const response = await fetch(`${apiBaseUrl}/trivia/questions?category=${category}&difficulty=${difficulty}&amount=${amount}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json()
            questions.value = data
            loading.value = false

            //set timer
            let timer = setInterval(() => {
                time.value += 1
            }, 1000);
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        console.error(error.message)
    }
})

const validateQueryParams = () => {
    //check if valid category
    const categoryCheck = (triviaCategories.some(item => item.id === Number(category))) || (Number(category) === 0)
    if(!categoryCheck) router.push('/not_found')

    //check if difficulty is valid
    const difficulties = ['any', 'easy', 'medium', 'hard']
    const difficultyCheck = difficulties.includes(difficulty)
    if(!difficultyCheck) router.push('/not_found')

    //check if amount is valid
    if(amount < 0 || amount > 50) router.push('/not_found')
}

const handleOptionClick = (option) => {
    selectedOption.value = option

    //build arrays to send to backend
    questionArr.value.push(questions.value[index.value].question)
    userInputArr.value.push(option)
    correctAnswerArr.value.push(questions.value[index.value].correct_answer)

    option === questions.value[index.value].correct_answer ? correctCount.value++ : incorrectCount.value++

    setTimeout(() => {
        index.value++
        selectedOption.value = ''
    }, 1400)

    //check if game is done
    if(index.value + 1 === questions.value.length){
        handleEndGame()
    }
}

const handleEndGame = async () => {
    if(localStorage.getItem('userInfo')){
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/users/post_game`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    correct_count: correctCount.value,
                    incorrect_count: incorrectCount.value,
                    time_taken: time.value,
                    question_arr: questionArr.value,
                    user_input_arr: userInputArr.value,
                    correct_answer_arr: correctAnswerArr.value,
                    category: Number(category) === 0 ? 'Any' : getCategory(Number(category)),
                    gamemode: 'Normal'
                })
            })
            if(response.ok){
                const data = await response.json()
                router.push(`/results/${data.id}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error.message)
        }
        
    } else {
        const resultData = {
            correct_count: correctCount.value,
            incorrect_count: incorrectCount.value,
            time_taken: time.value,
            question_arr: questionArr.value,
            user_input_arr: userInputArr.value,
            correct_answer_arr: correctAnswerArr.value,
            gamemode: 'Normal'
        }
        sessionStorage.setItem('resultData', JSON.stringify(resultData))
        router.push('/results')
    }
}

const difficultyBgColor = (difficulty) => {
    if(difficulty === 'easy'){
        return 'text-green-500'
    } else if(difficulty === 'medium'){
        return 'text-orange-400'
    } else {
        return 'text-red-500'
    }
}
</script>

<template>
    <div v-if="loading" class="flex items-center justify-center min-h-[calc(90vh-65px)]">
        <i class="pi pi-spinner animate-spin text-7xl"></i>
    </div>
    <div v-else>
        <div>Category: <span>{{ questions[index].category }}</span></div>
        <div><i class="pi pi-stopwatch"></i> <span>{{ formatTime(time) }}</span></div>
        <div>Question: <span>{{ index + 1 }}</span></div>
        <div>{{ questions[index].question }}</div>
        <div>Difficulty: <span :class="difficultyBgColor(questions[index].difficulty)">{{ questions[index].difficulty }}</span></div>

        <div class="border flex flex-col space-y-3">
            <button v-for="option of questions[index].options" :key="option" @click="handleOptionClick(option)">{{ option }}</button>
        </div>
    </div>

</template>