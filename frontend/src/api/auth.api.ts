import axios from 'axios'
import { ref } from 'vue'

const API = "http://localhost:4000/auth"

const routes = [
    "/iniciar-sesion", // 0
    "/registrarse", // 1
    "/perfil", // 2
    "/logout", // 3
    "/admin/data", // 4
    "/forgottenpass" //5
]

export const admin = ref("");
export const user = ref<{ id: string; email: string; username: string } | null>(null);

export const lemail = ref<string>('');
export const lpassword = ref<string>('');

export const rusername = ref<string>('');
export const remail = ref<string>('');
export const rpassword = ref<string>('');

let data;

export const logearseAPI = async() => {
    const resAPI = await axios.post(
        `${API}${routes[0]}`,
        {
            email: lemail.value,
            password: lpassword.value
        },
        { withCredentials: true }
    )

    data = resAPI.data;
    return data
}

export const registrarseAPI = async () => {
    const resAPI = await axios.post(
        `${API}${routes[1]}`, 
        {
            username: rusername.value,
            email: remail.value,
            password: rpassword.value
        }
    );
    data = resAPI.data;
    return data
}

export const obtenerPerfilAPI = async () => {
    const {data} = await axios.get(
        `${API}${routes[2]}`, 
        { withCredentials: true }
    )
    user.value = {
        id: data.email.id, // temporal si no lo tienes
        username: data.email.username, // temporal si no lo tienes
        email: data.email.email
    };
    return data
}

export const logoutAPI = async () => {
    const resAPI = await axios.post(
        `${API}${routes[3]}`,
        {}, 
        { withCredentials: true }
    )
    return resAPI
}

export const adminDataAPI = async () => {
    const { data } = await axios.get(
        `${API}${routes[4]}`, 
        { withCredentials: true }
    )
    admin.value = data.secretData
}

export const forgottenPassAPI = async () => {
    console.error(`${API}${routes[5]}`)
    const resAPI = await axios.post(
        `${API}${routes[5]}`,
        {
            emailFP: lemail.value,
        }
    )
    

    data = resAPI.data;

    return data;
}