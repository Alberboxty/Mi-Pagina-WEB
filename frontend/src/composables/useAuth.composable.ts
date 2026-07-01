import { ref } from 'vue'
import { useRouter } from 'vue-router'

import {
    logearseAPI,
    registrarseAPI,
    obtenerPerfilAPI,
    logoutAPI,
    adminDataAPI,
    forgottenPassAPI
} from '@/api/auth.api'

export function useAuth() {
    const router = useRouter()

    //errores:
    const errorLogin = ref("");
    const errorRegistro = ref("");
    const errorForgotten = ref("");
    const successForgotten = ref("");

    const logearse = async () => {
        try{
            errorLogin.value = ""; // limpia errores anteriores

            const login = await logearseAPI();
            console.log('Enviado correctamente:', login.ok);
            router.push('/perfil')

        } catch (error: any) {
            console.error('Error al loguearse', error);
            if (error.response?.data?.errors) {

                errorLogin.value = error.response?.data?.errors
                .map((e:any)=> e.msg)
                .join(", ");

            } else {
                errorLogin.value = error.response?.data?.msg || `Error inesperado al iniciar sesión ${error.response?.data?.msg}`;
            }
        }
    }

    const registrarse = async () => {
        try{
            errorRegistro.value = ""; // Limpiar errores

            const registro = await registrarseAPI();
            console.log('Enviado correctamente:', registro.ok);
        } catch (error: any) {
            console.error('Error al loguearse', error);

            if (error.response?.data?.errors) {

                errorRegistro.value = error.response?.data?.errors
                .map((e:any)=> e.msg)
                .join(", ");

            } else {
                errorRegistro.value = error.response?.data?.msg || `Error inesperado al Registrarse ${error.response?.data?.msg}`;
            }
        }
    
    }

    const obtenerPerfil = async () => {
        try {
            const res = await obtenerPerfilAPI();
            console.log( res.email )
        } catch (error: any) {
            console.error("Error", error?.response?.data.msg);
        }
    }

    const logout = async () => {
        try {
            const logOut = await logoutAPI()
            router.push('/auth');
        }catch(error){
            console.error("Error:", error);
        }
    }

    const adminData = async () => {
        try {
            const res = await adminDataAPI();
        } catch (error: any){
            if (error.response?.status === 401 ){
                console.error("Error: ", error.response?.data.msg)
                router.push("/auth")
            }

            if (error.response?.status === 403 ){
                console.error("Error: ", error.response?.data.msg)
                router.push("/perfil")
            }
        }
    }

    const forgottenPass = async () => {
        try{
            errorForgotten.value = "";
            successForgotten.value = "";
            const forgotten = await forgottenPassAPI();
            console.log('Enviado correctamente', forgotten);
            successForgotten.value = forgotten.msg;
        } catch(error: any) {
            console.error('Error al enviar email:', error);
            if (error.response?.data?.errors) {

                errorForgotten.value = error.response?.data?.errors
                .map((e:any)=> e.msg)
                .join(", ");

            } else {
                errorForgotten.value = error.response?.data?.msg || `Error inesperado al enviar email. ${error.response?.data?.msg}`;
            }
        }
    }

    return {
        errorLogin,
        errorRegistro,
        errorForgotten,
        successForgotten,
        logearse,
        registrarse,
        obtenerPerfil,
        logout,
        adminData,
        forgottenPass
    }
}