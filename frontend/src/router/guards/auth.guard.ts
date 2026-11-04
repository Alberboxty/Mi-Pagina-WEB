import type { NavigationGuard } from 'vue-router';
import { obtenerPerfilAPI } from '@/api/auth.api';

export const authGuard: NavigationGuard = async () => {
    console.log('[AUTH GUARD] Comprobando sesión');

    try {
        await obtenerPerfilAPI();

        console.log('[AUTH GUARD] Sesión válida');

        return true;

    } catch (error: any) {
        console.error('[AUTH GUARD] Error:', error);

        if (error.response?.status === 401) {
            return { name: 'Auth' };
        }

        return false;
    }
};