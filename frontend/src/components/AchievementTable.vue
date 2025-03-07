<template>
    <div class='m-4 md:m-0 space-y-3 col-span-2 flex flex-col items-center md:pt-6'>
        <div class="md:w-3/5 space-y-3">
            <div class='text-center text-2xl font-medium'>Trivia Achievements</div>
            <div>Track your achievements and become a trivia master! To keep track of your achievements, please login or create an account.</div>
            <table class='w-full border-separate border-spacing-0 shadow-xl rounded-md bg-white overflow-hidden'>
                <thead class='bg-gray-300 dark:bg-lighterPrimary border-b border-b-gray-400 rounded-md'>
                    <tr >
                        <th class="p-1">Achievement</th>
                        <th class="p-1">Description</th>
                    </tr>
                </thead>
                <tbody class='text-center'>
                    <tr>
                        <td class='p-1'>Trivia Master</td>
                        <td class='p-1'>Achieve a perfect score</td>
                    </tr>
                    <tr>
                        <td class='p-1'>Trivia Wizard</td>
                        <td class='p-1'>Achieve a 3-game perfect score streak</td>
                    </tr>
                    <tr>
                        <td class='p-1'>Trivia Specialist</td>
                        <td class='p-1'>Achieve a 5-game perfect score streak</td>
                    </tr>
                    <tr>
                        <td class='p-1'>Trivia Genius</td>
                        <td class='p-1'>Achieve a 10-game perfect score streak</td>
                    </tr>
                    <tr>
                        <td class='p-1'>Trivia King</td>
                        <td class='p-1'>Achieve a 20-game perfect score streak</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>