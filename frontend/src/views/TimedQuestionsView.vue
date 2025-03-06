<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import formatTime from '@/utils/formatTime';
import { triviaCategories } from '@/data/categories';
// import sampleQuestions from '@/data/sampleQuestionData';
import AnswerButton from '@/components/AnswerButton.vue';

const route = useRoute(); 
const router = useRouter()
const { category, difficulty, amount } = route.query

const questions = ref(null)
const index = ref(0)
const time = ref(0)
const seconds = ref(Number(JSON.parse(sessionStorage.getItem('time_limit'))) || 10)
const originalSeconds = ref(Number(JSON.parse(sessionStorage.getItem('time_limit'))) || 10)
const selectedOption = ref('')
const questionArr = ref([])
const userInputArr = ref([])
const correctAnswerArr = ref([])
const correctCount = ref(0)
const incorrectCount= ref(0)
const loading = ref(true)
const clicked = ref(false)

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

            let stopwatch = setInterval(() => {
                time.value += 1
            }, 1000);
            
            let timer = setInterval(() => {
                seconds.value -= 1
            }, 1000);
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        console.error(error.message)
    }
    // questions.value = sampleQuestions
    // loading.value = false

    // let stopwatch = setInterval(() => {
    //     time.value += 1
    // }, 1000);

    // let timer = setInterval(() => {
    //     seconds.value -= 1
    // }, 1000);
})

//handles running out of time
watchEffect(() => {
    if(seconds.value === 0){
        //handle arrays
        questionArr.value.push(questions.value[index.value].question)
        userInputArr.value.push('Ran out of time!')
        correctAnswerArr.value.push(questions.value[index.value].correct_answer)

        incorrectCount.value++

        setTimeout(() => {
            //check if game is done
            if(index.value + 1 === questions.value.length){
                handleEndGame()
                return
            }
            
            index.value++
            selectedOption.value = ''
            clicked.value = false

            //reset timer
            seconds.value = Number(JSON.parse(sessionStorage.getItem('time_limit'))) || 10
            
        }, 1400)
    }
})

const validateQueryParams = () => {
    const categoryCheck = (triviaCategories.some(item => item.id === Number(category))) || (Number(category) === 0)
    if(!categoryCheck) router.push('/not_found')

    const difficulties = ['any', 'easy', 'medium', 'hard']
    const difficultyCheck = difficulties.includes(difficulty)
    if(!difficultyCheck) router.push('/not_found')

    if(amount < 0 || amount > 50) router.push('/not_found')
}

const handleOptionClick = (option) => {
    selectedOption.value = option
    clicked.value = true

    //build arrays to send to backend
    questionArr.value.push(questions.value[index.value].question)
    userInputArr.value.push(option)
    correctAnswerArr.value.push(questions.value[index.value].correct_answer)

    option === questions.value[index.value].correct_answer ? correctCount.value++ : incorrectCount.value++

    setTimeout(async () => {

        //check if game is done
        if(index.value + 1 === questions.value.length){
            await handleEndGame()
            return
        }

        index.value++
        selectedOption.value = ''
        clicked.value = false

        //reset timer
        seconds.value = Number(JSON.parse(sessionStorage.getItem('time_limit'))) || 10
    }, 1400)
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
                    category: category === 0 ? 'Any' : category,
                    gamemode: 'Timed'
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
            gamemode: 'Timed'
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

const buttonBgColor = (option) => {
    if(selectedOption.value === option && option === questions.value[index.value].correct_answer){
        return 'bg-green-500 hover:bg-green-500 correct'
    } else if(option === selectedOption.value && option !== questions.value[index.value].correct_answer) {
        return 'bg-red-500 hover:bg-red-500 shake'
    } else {
        return 'bg-gray-400'
    }
}

const correctAnswer = (option) => {
    if(selectedOption.value === option && option === questions.value[index.value].correct_answer){
        return true
    } else {
        return false
    }
}
</script>

<template>
    <div v-if="loading" class="flex items-center justify-center min-h-[calc(90vh-65px)]">
        <i class="pi pi-spinner animate-spin text-7xl text-purple-600"></i>
    </div>
    <div v-else class="mt-3 space-y-3 mx-4 md:mx-0">
        <div class="bg-white rounded-md shadow-xl text-center space-y-3 p-3 md:w-2/3 mx-auto">
            <div class="text-xl font-semibold">Category: <span class="text-purple-600">{{ questions[index].category }}</span></div>
            <div class="text-lg font-semibold"><i class="pi pi-stopwatch"></i> <span>{{ formatTime(time) }}</span></div>
            <div class="text-lg">Question: <span class="text-purple-600">{{ index + 1 }}</span></div>
            <div class="text-xl">{{ questions[index].question }}</div>
            <div>Difficulty: <span :class="difficultyBgColor(questions[index].difficulty)">{{ questions[index].difficulty }}</span></div>
            <div class="w-full h-4 bg-gray-300 rounded-md overflow-hidden">
                <div :class="`h-full bg-red-500 transition-all ease-linear duration-1000 ${(seconds/originalSeconds === 1) ? 'transition-none' : ''} ${seconds < 3 ? 'flash-danger' : ''}`" 
                    :style="{ width: `${(seconds / originalSeconds) * 100}%` }">
                </div>
            </div>
        </div>

        <div class="flex flex-col space-y-3 md:w-2/3 mx-auto">
            <AnswerButton 
                v-for="option of questions[index].options" 
                :key="option" :option="option" 
                :handleOptionClick="handleOptionClick" 
                :buttonBgColor="buttonBgColor" 
                :clicked="clicked"
                :correctAnswer="correctAnswer"
            />
        </div>
    </div>
</template>

<style>
@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.flash-danger {
  animation: flash 0.5s infinite ease-in-out;
}
</style>