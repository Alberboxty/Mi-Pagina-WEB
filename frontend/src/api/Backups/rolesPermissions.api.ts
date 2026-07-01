import axios from 'axios'
import type { rolesPermissions } from '@/types/rolesPermissions.type';
// import { ref } from 'vue'

const API = "http://localhost:4000/rolespermissions"

export const obtenerRolesPermissions = async(): Promise<rolesPermissions[]> => {
    const res = await axios.get(`${API}`);
    return res.data;
}

export const crearRolePermission = async(data: object): Promise<rolesPermissions> => {
    const res = await axios.post(
        `${API}`,
        data
        //{withCredentials: true}
    );
    return res.data;
}

export const eliminarRolePermission = async ( id_rol: number, id_permission: number) => {
    const res = await axios.delete(
        `${API}/${id_rol}/${id_permission}`
        //{withCredentials: true}
    )
}