import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Page de connexion affichée au lancement.
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/WelcomeView.vue'),
    },
  ],
})

export default router
