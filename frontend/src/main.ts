//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

console.log('[MAIN] Antes de crear Vue');

const app = createApp(App)

console.log('[MAIN] Vue creado');
app.use(createPinia())
app.use(router)

console.log('[MAIN] Plugins instalados');
app.mount('#app')

console.log('[MAIN] Aplicación montada');

router.beforeEach((to, from) => {
    console.log('[ROUTER] Navegando:', from.fullPath, '→', to.fullPath);
});

router.afterEach((to, from, failure) => {
    console.log('[ROUTER] Navegación finalizada:', to.fullPath, failure);
});

router.onError((error) => {
    console.error('[ROUTER] Error:', error);
});

