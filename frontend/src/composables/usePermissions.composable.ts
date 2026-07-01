import { ref } from 'vue'
import {
    obtenerPermissions,
    crearPermissions,
    editarPermission,
    eliminarPermission
} from '@/api/permissions.api'

import type { permisos } from '@/types/permisos.type'

export function usePermissions() {

    const permisos = ref<permisos[]>([])

    const nombrePermiso = ref<string>('')

    const modoFormularioPermissions = ref<'crear' | 'editar'>('crear');
    const idPermissionSeleccionado = ref<number | null>(null);

    const resetPermissionFormulario = () => {
        modoFormularioPermissions.value = 'crear';
        nombrePermiso.value = '';
        idPermissionSeleccionado.value = null;
    }


    const obtenerFPermissions = async() => {
        try{
            permisos.value = await obtenerPermissions()
        } catch (error) {
            console.error("Error no se obtuvo los permisos", error)
        }
    }

    const creaFPermissions = async() => {
        try{
            let data = {
                nombre: nombrePermiso.value
            }

            if (modoFormularioPermissions.value === 'crear') {
                
                const enviar = await crearPermissions(data)

                // Agregar a la lista local
                permisos.value.push(enviar)

            } else {

                if (!idPermissionSeleccionado.value) {
                    console.error("No hay ID seleccionada")
                    return
                }
                
                const editar = await editarPermission(idPermissionSeleccionado.value, data)

                // Actualizar la lista local de forma reactiva
                const index = permisos.value.findIndex(s => s.id_permission === idPermissionSeleccionado.value)
                if ( index !== -1) {
                    permisos.value.splice(index, 1, editar)
                }

            }

            resetPermissionFormulario();

        } catch (error) {
            console.error('Error al crear permiso', error);
        }
    }

    const editarFPermissions = async(permiso: permisos) => {
        //Llenar inputs
        nombrePermiso.value = permiso.nombre

        idPermissionSeleccionado.value = permiso.id_permission
        modoFormularioPermissions.value = 'editar'

    }

    const eliminarFPermissions = async(id_permission:number) => {
        const confirmar = confirm('¿Seguro que quieres eliminar este permiso?');
        if (!confirmar) return;
        try {
            await eliminarPermission(id_permission)
            
            permisos.value = permisos.value.filter(
                servidor => servidor.id_permission !== id_permission
            );

        } catch (error) {
            console.error('Error al eliminar permiso', error);
            alert('No se pudo eliminar el permiso');
        }

    }



    return {
        obtenerFPermissions,
        permisos,
        nombrePermiso,
        creaFPermissions,
        modoFormularioPermissions,
        editarFPermissions,
        eliminarFPermissions
    }

}