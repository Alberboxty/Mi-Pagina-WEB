import { ref } from 'vue'
import {
    obtenerRolesPermissions,
    crearRolePermission,
    eliminarRolePermission
} from '@/api/rolesPermissions.api'

import type { rolesPermissions } from '@/types/rolesPermissions.type'

export function useRolesPermissions() {

    const rolesPermissions = ref<rolesPermissions[]>([])

    const input_IDRoles = ref<number| null>(null)
    const input_IDPermissions = ref<number| null>(null)

    
    const resetRolesPermissionsFormulario = () => {
        input_IDRoles.value = null;
        input_IDPermissions.value = null;
    }


    const obtenerFRolesPermissions = async() => {
        try{
            rolesPermissions.value = await obtenerRolesPermissions()
        } catch (error) {
            console.error("Error no se obtuvo los permisos", error)
        }
    }

    const creaFRolePermission = async() => {
        try{
            let data = {
                idRol: input_IDRoles.value,
                idPermission: input_IDPermissions.value
            }

            const enviar = await crearRolePermission(data)

            resetRolesPermissionsFormulario();
        } catch (error) {
            console.error('Error al crear permiso', error);
        }
    }

    // const editarFRol = async(rol: roles) => {
    //     //Llenar inputs
    //     nombreRoles.value = rol.rol_name

    //     idRolesSeleccionado.value = rol.id_rol
    //     modoFormularioRoles.value = 'editar'

    // }

    const eliminarFRolePermission = async(id_rol:number, id_permission:number) => {
        const confirmar = confirm('¿Seguro que quieres eliminar este permiso?');
        if (!confirmar) return;
        try {
            await eliminarRolePermission(id_rol, id_permission)
           
            rolesPermissions.value = rolesPermissions.value.filter(
                rp =>
                    !(
                        rp.id_rol === id_rol &&
                        rp.id_permission === id_permission
                    )
            );

        } catch (error) {
            console.error('Error al eliminar permiso', error);
            alert('No se pudo eliminar el permiso');
        }

    }



    return {
        obtenerFRolesPermissions,
        creaFRolePermission,
        rolesPermissions,
        input_IDRoles,
        input_IDPermissions,
        eliminarFRolePermission
    }

}