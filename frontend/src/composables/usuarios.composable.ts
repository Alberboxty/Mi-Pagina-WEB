import { 
    eliminarUsuario, 
    obtenerUsuarios, 
    enviarUsuarios 
} from '@/api/usuarios.api'
import type { usuarios } from '@/types/usuarios.types'
import { ref } from 'vue'


export const input_usuario = ref<string>('')
export const input_email = ref<string>('')
export const input_id_rol = ref<number>()
export const input_verified = ref<boolean>()

export function useUsuarios() {

    const idUsuarioSel = ref<number | null>(null);

    const usuarios = ref<usuarios[]>([])

    const obtenerFUsuarios = async() => {
        try {
            usuarios.value = await obtenerUsuarios();
        }catch (error){
            console.error("Error no se obtuvo los usuarios", error)
        }
    }

    const enviarFUsuarios = async() => {
        try{
            if (!idUsuarioSel.value) {
                console.error("No hay ID seleccionada")
                return
            }

            let inputsData = {
                username: input_usuario.value,
                email: input_email.value,
                id_rol: input_id_rol.value,
                verified: input_verified.value
            }
            

            const enviar = await enviarUsuarios(idUsuarioSel.value, inputsData)

            // Actualizar la lista local de forma reactiva
            const index = usuarios.value.findIndex(s => s.id === idUsuarioSel.value)
            if ( index !== -1) {
                usuarios.value.splice(index, 1, enviar)
            }

        } catch (error){
            console.error('Error al editar usuario', error);
        }

    }

    const editarFUsuario = async(usuario: usuarios) => {
        try {
            input_usuario.value = usuario.username
            input_email.value = usuario.email
            input_id_rol.value = usuario.id_rol
            input_verified.value = usuario.verified

            idUsuarioSel.value = usuario.id

        } catch (error) {
            console.error('Error en imprimir datos al input.', error);
        }
        
    }

    const eliminarFUsuario = async(id: number) => {
        const confirmar = confirm('¿Seguro que quieres eliminar este usuario?');
        if (!confirmar) return;

        try {
            await eliminarUsuario(id);

            // quitar de la lista sin volver a pedir todo
            usuarios.value = usuarios.value.filter(
                usuarios => usuarios.id !== id
            );

        } catch (error) {
            console.error('Error al eliminar el usuario', error)
            alert('No se pudo eliminar el usuario');
        }
    }

    return {
        obtenerFUsuarios,
        usuarios,
        eliminarFUsuario,
        editarFUsuario,
        enviarFUsuarios
    }

}