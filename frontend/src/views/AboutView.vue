<template>
    <div class='px-3 md:px-0 md:w-3/4 md:mx-auto space-y-4'>
            <div class='text-2xl font-bold text-center mt-3'>About</div>
            
            <div>
                <div class='text-xl font-semibold'>Introduction</div>
                <p>Welcome to the Trivia Game App. This is a full stack application using Vue.js, PostgreSQL, Express and Node.js.
                    All trivia data is pulled from <a class='text-blue-500 hover:underline' href="https://opentdb.com/" target="_blank">TMDB</a>.
                </p>
            </div>

            <div>
                <div class='text-xl font-semibold'>Backend Features</div>
                <ul class='list-disc pl-5'>
                    <li>Track game statistics such as overall average, total games, total correct answers and more</li>
                    <li>Track game history</li>
                    <li>Earn Achievements for perfect scores</li>
                </ul>
            </div>

            <div>
                <div class='text-xl font-semibold'>Frontend</div>
                <ul class='list-disc pl-5'>
                    <li>Frontend implemented using Vue.js framework</li>
                    <li>Styling implemented using Tailwind CSS</li>
                </ul>
            </div>

            <div>
                <div class='text-xl font-semibold'>Hosting/Implementation</div>
                <ul class='list-disc pl-5'>
                    <li>Server implemented using Node.js and Express</li>
                    <li>Database implemented using PostgreSQL</li>
                    <li>Hosted on Linode Linux VM</li>
                </ul>
            </div>

            <div>For more details about the code, check out the <a class='text-blue-500 hover:underline' href="https://github.com/arriagada689/trivia-app" target="_blank">project github page</a>.</div>
        </div>
</template>