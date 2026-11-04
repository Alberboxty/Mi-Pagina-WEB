import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import { authGuard } from '@/router/guards/auth.guard';
import { guestGuard } from '@/router/guards/guest.guard';
import { adminGuard } from '@/router/guards/admin.guard';

const routes = [
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
    path: '/noticias/:id',
    name: 'Noticia',
    component: () => import('@/components/Home/NoticiasAPI/NoticiasAPI.Articulo.vue'),
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('@/views/Auth/profile/Perfil.vue'),
    beforeEnter: authGuard
  },
  {
    path: '/admin',
    name: 'PanelControl',
    component: () => import('@/views/Auth/admin/PanelControl.vue'),
    beforeEnter: adminGuard
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/Auth/Auth.vue'),
    beforeEnter: guestGuard
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
  {
    path: '/TestEditor',
    name: 'TestEditor',
    component: () => import('@/views/Test/Editor.vue'),
  },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router
