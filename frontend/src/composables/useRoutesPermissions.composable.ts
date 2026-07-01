import { ref } from 'vue'
import type { RoutePermisos } from "@/types/routePermission.type";

import {
    obtenerRoutesPermissions,
    crearRoutePermission,
    editarRoutePermission,
    eliminarRoutePermission

} from '@/api/routesPermissions.api'
 
export function useRoutesPermissions() {
    const routesPermisos = ref<RoutePermisos[]>([])
    const input_RouteAPI = ref<string>('')
    const input_Method = ref<string>('')
    const input_R_IDPermission = ref<number | null>(null)
    const input_IsPublic = ref<boolean>(false)

    const modoFormularioRoutesPermissions = ref<'crear' | 'editar'>('crear');
    const idSeleccionadoRoutesPermissions = ref<number | null>(null)

    const resetRoutesPermissionsFormulario = () => {
        modoFormularioRoutesPermissions.value = 'crear';
        input_RouteAPI.value = '';
        input_Method.value = '';
        input_R_IDPermission.value = null;
        idSeleccionadoRoutesPermissions.value = null;
    }

    const obtenerFRoutesPermissions = async() => {
        try{
            routesPermisos.value = await obtenerRoutesPermissions() 
        } catch (error) {
            console.error("Error no se obtuvo los permisos", error)
        }
    }

    const creaFRoutePermission = async() => {
            try{
                let data = {
                    route: input_RouteAPI.value,
                    method: input_Method.value,
                    id_permission: input_R_IDPermission.value,
                    is_public: input_IsPublic.value
                }
    
                if (modoFormularioRoutesPermissions.value === 'crear') {
                    
                    const enviar = await crearRoutePermission(data)
    
                    // Agregar a la lista local
                    routesPermisos.value.push(enviar)
    
                } else {
    
                    if (!idSeleccionadoRoutesPermissions.value) {
                        console.error("No hay ID seleccionada")
                        return
                    }
                    
                    const editar = await editarRoutePermission(idSeleccionadoRoutesPermissions.value, data)
    
                    // Actualizar la lista local de forma reactiva
                    const index = routesPermisos.value.findIndex(s => s.id_permission === idSeleccionadoRoutesPermissions.value)
                    if ( index !== -1) {
                        routesPermisos.value.splice(index, 1, editar)
                    }
    
                }
    
                resetRoutesPermissionsFormulario();
    
            } catch (error) {
                console.error('Error al crear permiso', error);
            }
        }

    const editarFRoutePermission = async(routePermiso: RoutePermisos) => {
        //Llenar inputs
        input_RouteAPI.value = routePermiso.route
        input_Method.value = routePermiso.method
        input_R_IDPermission.value = routePermiso.id_permission
        idSeleccionadoRoutesPermissions.value = routePermiso.id_route_permission
        modoFormularioRoutesPermissions.value = 'editar'
    }

    const eliminarFRoutePermission = async(id_route_permission:number) => {
        const confirmar = confirm('¿Seguro que quieres eliminar este permiso?');
        if (!confirmar) return;
        try {
            await eliminarRoutePermission(id_route_permission)
            
            routesPermisos.value = routesPermisos.value.filter(
                routePermiso => routePermiso.id_route_permission !== id_route_permission
            );

        } catch (error) {
            console.error('Error al eliminar permiso', error);
            alert('No se pudo eliminar el permiso');
        }
    }

    return {
        obtenerFRoutesPermissions,
        creaFRoutePermission,
        editarFRoutePermission,
        eliminarFRoutePermission,
        routesPermisos,
        input_RouteAPI,
        input_Method,
        input_R_IDPermission,
        idSeleccionadoRoutesPermissions,
        modoFormularioRoutesPermissions,
        input_IsPublic
        
    }

}