import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import QuestionsView from "@/views/QuestionsView.vue";
import TimedQuestionsView from "@/views/TimedQuestionsView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import ResultsView from "@/views/ResultsView.vue";
import LeaderboardView from "@/views/LeaderboardView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/questions',
            name: 'questions',
            component: QuestionsView
        },
        {
            path: '/timed_questions',
            name: 'timed_questions',
            component: TimedQuestionsView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/results/:id?',
            name: 'results',
            component: ResultsView
        },
        {
            path: '/leaderboard',
            name: 'leaderboard',
            component: LeaderboardView
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ]
})

export default router