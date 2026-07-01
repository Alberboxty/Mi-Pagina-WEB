import { ref } from 'vue'
import {
    obtenerRoles,
    crearRoles,
    editarRoles,
    eliminarRoles
} from '@/api/roles.api'

import type { roles } from '@/types/roles.type'

export function useRoles() {

    const roles = ref<roles[]>([])

    const nombreRoles = ref<string>('')

    const modoFormularioRoles = ref<'crear' | 'editar'>('crear');
    const idRolesSeleccionado = ref<number | null>(null);

    const resetRolesFormulario = () => {
        modoFormularioRoles.value = 'crear';
        nombreRoles.value = '';
        idRolesSeleccionado.value = null;
    }


    const obtenerFRoles = async() => {
        try{
            roles.value = await obtenerRoles()
        } catch (error) {
            console.error("Error no se obtuvo los permisos", error)
        }
    }

    const creaFRol = async() => {
        try{
            let data = {
                rol_name: nombreRoles.value
            }

            if (modoFormularioRoles.value === 'crear') {
                
                const enviar = await crearRoles(data)

                // Agregar a la lista local
                roles.value.push(enviar)

            } else {

                if (!idRolesSeleccionado.value) {
                    console.error("No hay ID seleccionada")
                    return
                }
                
                const editar = await editarRoles(idRolesSeleccionado.value, data)

                // Actualizar la lista local de forma reactiva
                const index = roles.value.findIndex(s => s.id_rol=== idRolesSeleccionado.value)
                if ( index !== -1) {
                    roles.value.splice(index, 1, editar)
                }

            }

            resetRolesFormulario();

        } catch (error) {
            console.error('Error al crear permiso', error);
        }
    }

    const editarFRol = async(rol: roles) => {
        //Llenar inputs
        nombreRoles.value = rol.rol_name

        idRolesSeleccionado.value = rol.id_rol
        modoFormularioRoles.value = 'editar'

    }

    const eliminarFRol = async(id_rol:number) => {
        const confirmar = confirm('¿Seguro que quieres eliminar este permiso?');
        if (!confirmar) return;
        try {
            await eliminarRoles(id_rol)
            
            roles.value = roles.value.filter(
                roles => roles.id_rol !== id_rol
            );

        } catch (error) {
            console.error('Error al eliminar permiso', error);
            alert('No se pudo eliminar el permiso');
        }

    }



    return {
        obtenerFRoles,
        roles,
        nombreRoles,
        creaFRol,
        modoFormularioRoles,
        editarFRol,
        eliminarFRol
    }

}