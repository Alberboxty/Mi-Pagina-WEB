import axios from 'axios'
import type { RoutePermisos } from '@/types/routePermission.type';

const API = "http://localhost:4000/admin/routespermissions"

export const obtenerRoutesPermissions = async(): Promise<RoutePermisos[]> => {
    const res = await axios.get(`${API}`, {withCredentials: true});
    return res.data;
}

export const crearRoutePermission = async(data: object): Promise<RoutePermisos> => {
    const res = await axios.post(
        `${API}`,
        data,
        {withCredentials: true}
    );
    return res.data;
}

export const editarRoutePermission = async ( id_route_permission: number, data: object ): Promise<RoutePermisos> => {
    const res = await axios.patch(
        `${API}/${id_route_permission}`,
        data,
        {withCredentials: true}
    );
    return res.data;
}

export const eliminarRoutePermission = async ( id_route_permission: number) => {
    const res = await axios.delete(
        `${API}/${id_route_permission}`,
        {withCredentials: true}
    )
}


