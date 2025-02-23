<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { triviaCategories } from '@/data/categories';

const router = useRouter();

const category = ref(0)
const difficulty = ref('any')
const limit = ref(50)
const amount = ref(1)
const gamemode = ref('Normal')
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

</script>

<template>
    
    <!--Prompt Section-->
    <div className='space-y-2'>

        <!--Category dropdown-->
        <div className='text-center text-2xl font-medium'>Select <span className='text-secondary'>Category</span></div>
        <select name="categories" id="categories" v-model="category" className='w-full text-center border dark:bg-primary dark:border-white border-black p-1 text-lg'>
            <option :value="0">Any Category</option>
            <option v-for="category of categories" :value="category['id']" :key="category['id']">{{ category['name'] }}</option>
        </select>

        <!--Difficulty dropdown-->
        <div className='space-y-2'>
            <div className='text-center text-2xl font-medium'>Select <span className='text-secondary'>Difficulty</span></div>
            <select name="difficulty" id="difficulty" v-model="difficulty" className='w-full text-center border dark:bg-primary dark:border-white border-black p-1 text-lg'>
              <option :value="'any'">Any Difficulty</option>
              <option :value="'easy'">Easy</option>
              <option :value="'medium'">Medium</option>
              <option :value="'hard'">Hard</option>
            </select>
        </div>

        <!--Amount dropdown-->
        <div className='space-y-2'>
            <div className='text-center text-2xl font-medium'>Select <span className='text-secondary'>Amount</span></div>
            <select name="amount" id="amount" v-model="amount" className='w-full text-center border dark:bg-primary dark:border-white border-black p-1 text-lg'>
                <option v-for="(num, index) of new Array(limit).fill(1)" :value="index + 1" :key="index">{{ index + 1 }}</option>
            </select>
        </div>

        <!--Gamemode dropdown-->
        <div className='space-y-2'>
            <div className='text-center text-2xl font-medium'>Select <span className='text-secondary'>Game Mode</span></div>
            <select name="gamemode" id="gamemode" v-model="gamemode" className='w-full text-center border dark:bg-primary dark:border-white border-black p-1 text-lg'>
                <option :value="'Normal'">Normal</option>
                <option :value="'Timed'">Timed</option>
            </select>
        </div>
    </div>

    <button @click="handleStart" class="bg-green-500 text-white">Start</button>

</template>