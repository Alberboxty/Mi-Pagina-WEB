import axios from 'axios'
import type { roles } from '@/types/roles.type';
// import { ref } from 'vue'

const API = "http://localhost:4000/roles"

export const obtenerRoles = async(): Promise<roles[]> => {
    const res = await axios.get(`${API}`);
    return res.data;
}

export const crearRoles = async(data: object): Promise<roles> => {
    const res = await axios.post(
        `${API}`,
        data
        //{withCredentials: true}
    );
    return res.data;
}

export const editarRoles = async ( idRolesSeleccionado: number, data: object ): Promise<roles> => {
    const res = await axios.patch(
        `${API}/${idRolesSeleccionado}`,
        data
        //{withCredentials: true}
    );
    return res.data;
}

export const eliminarRoles = async ( idPermissionSeleccionado: number) => {
    const res = await axios.delete(
        `${API}/${idPermissionSeleccionado}`
        //{withCredentials: true}
    )
}