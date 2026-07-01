import axios from 'axios'
import { ref } from 'vue'

const API = "http://localhost:4000/recoveryPass"

export const newpassword = ref<string>("");
export const confirmpassword = ref<string>("");

const routes = [
    "/recoveryPass" //0
]

let data;

export const recoveryPassAPI = async(token: string) => {
    const resAPI = await axios.post(
        `${API}${routes[0]}/${token}`,
        {
            newPassword: newpassword.value,
            confirmPassword: confirmpassword.value
        },
        { withCredentials: true }
    )

    data = resAPI.data;
    return data;
}