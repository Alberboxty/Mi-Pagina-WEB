import { ref } from 'vue'

import {
    recoveryPassAPI
} from '@/api/recoveryPass.api'

export function useRecoveryPass(token: string) {
    const errorRecovery = ref("");
    const successRecovery = ref("");
    console.log("ver token:", token)
    const recoveryPass = async () => {
        try {
            errorRecovery.value = "";
            successRecovery.value = "";
            const recovery = await recoveryPassAPI(token);
            successRecovery.value = recovery.msg;
            console.log('Correcto:', recovery.msg)
        } catch (error: any) {
            console.error('Error al recuperar contraseña:', error);
            
            if (error.response?.data?.errors) {
                errorRecovery.value = error.response?.data?.errors
                .map((e:any)=> e.msg)
                .join(", ");

            } else {
                errorRecovery.value = error.response?.data?.msg || "Error inesperado al recuperar la contraseña.";
            }
        }
    }
    return {
        recoveryPass,
        errorRecovery,
        successRecovery

    }
}