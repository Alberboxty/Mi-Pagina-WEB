import type { NavigationGuard } from 'vue-router';
import { obtenerPerfilAPI } from '@/api/auth.api';

export const guestGuard: NavigationGuard = async () => {
    console.log('[GUEST GUARD] Comprobando sesión');

    try {
        await obtenerPerfilAPI();

        console.log('[GUEST GUARD] Ya hay una sesión');

        return { name: 'Perfil' };

    } catch (error: any) {
        console.error('[GUEST GUARD] Error:', error);

        if (error.response?.status === 401) {
            return true;
        }

        return false;
    }
};