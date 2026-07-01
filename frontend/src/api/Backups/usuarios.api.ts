import type { usuarios } from '@/types/usuarios.types';
import axios from 'axios'

const API = "http://localhost:4000/usuarios"

export const obtenerUsuarios = async(): Promise<usuarios[]> => {
    const res = await axios.get(`${API}`);
    return res.data;
}


export const enviarUsuarios = async ( id: number, inputsData: object) => {
    
    const res = await axios.patch(
        `${API}/${id}`, 
        inputsData
        //{withCredentials: true}
    )
    return res.data
}

export const eliminarUsuario = async(id: number) => {
    const res = await axios.delete(
        `${API}/${id}`
        //{withCredentials: true}
    )
}