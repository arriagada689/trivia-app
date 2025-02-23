import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import QuestionsView from "@/views/QuestionsView.vue";
import TimedQuestionsView from "@/views/TimedQuestionsView.vue";

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
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ]
})

export default router