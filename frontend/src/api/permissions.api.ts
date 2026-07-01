import axios from 'axios'
import type { permisos } from '@/types/permisos.type';
// import { ref } from 'vue'

const API = "http://localhost:4000/admin/permisos"

export const obtenerPermissions = async(): Promise<permisos[]> => {
    const res = await axios.get(`${API}`, {withCredentials: true});
    return res.data;
}

export const crearPermissions = async(data: object): Promise<permisos> => {
    const res = await axios.post(
        `${API}`,
        data,
        {withCredentials: true}
    );
    return res.data;
}

export const editarPermission = async ( idPermissionSeleccionado: number, data: object ): Promise<permisos> => {
    const res = await axios.patch(
        `${API}/${idPermissionSeleccionado}`,
        data,
        {withCredentials: true}
    );
    return res.data;
}

export const eliminarPermission = async ( idPermissionSeleccionado: number) => {
    const res = await axios.delete(
        `${API}/${idPermissionSeleccionado}`,
        {withCredentials: true}
    )
}