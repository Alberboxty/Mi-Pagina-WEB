import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: HomeView,
    },
    {
      path: '/servidores/Servidores',
      name: 'Servidores',
      component: () => import('@/views/servidores/Servidores.vue'),
    },
    {
      path: '/noticias',
      name: 'Noticias',
      component: () => import('@/views/noticias/Noticias.vue'),
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: () => import('@/views/Auth/profile/Perfil.vue'),
    },
    {
      path: '/admin',
      name: 'PanelControl',
      component: () => import('@/views/Auth/admin/PanelControl.vue'),
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/Auth/Auth.vue'),
    },
    {
      path: '/auth/forgotten',
      name: 'Authforgotten',
      component: () => import('@/views/Auth/ForgottenPass.vue'),
    },
    {
      path: '/auth/recovery/:token',
      name: 'Authrecovery',
      component: () => import('@/views/Auth/RecoveryAuth.vue'),
    },
    
  ],
})

export default router
