import type { NavigationGuard } from 'vue-router';
import { adminDataAPI } from '@/api/auth.api';

export const adminGuard: NavigationGuard = async () => {
    console.log('[ADMIN GUARD] Comprobando permisos');

    try {
        await adminDataAPI();

        console.log('[ADMIN GUARD] Acceso autorizado');

        return true;

    } catch (error: any) {
        console.error('[ADMIN GUARD] Error:', error);

        const status = error.response?.status;

        if (status === 401) {
            return { name: 'Auth' };
        }

        if (status === 403) {
            return { name: 'Perfil' };
        }

        return false;
    }
};