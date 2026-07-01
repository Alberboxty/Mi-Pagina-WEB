import { ref } from 'vue'
import type { servidores } from '@/types/servidores.types';
import {
    obtenerServidores,
    crearServidor,
    editarServidor,
    eliminarServidor
} from '@/api/contenido/servidores.api'

const input_nombre_servidor = ref<string>('')
const input_estado = ref<string>('')
const input_ip = ref<string>('')
const imagenFile = ref<File | null>(null)
const imagenPreview = ref<string | null>(null)
const input_description = ref<string>('')

const modoFormulario = ref<'crear' | 'editar'>('crear');

const idSeleccionado = ref<number | null>(null);

export function useServidores() {

    const servidores = ref<servidores[]>([])
 
    const onFileChange = (event: Event) => {
        const input = event.target as HTMLInputElement

        if (input.files && input.files.length > 0) {
            const file = input.files[0]

            imagenFile.value = file              // 👈 ARCHIVO REAL
            imagenPreview.value = URL.createObjectURL(file) // 👈 PREVIEW
        }
    }

    const resetFormulario = () => {
        input_nombre_servidor.value = '';
        input_estado.value = '';
        input_ip.value = '';
        input_description.value = '';
        imagenFile.value = null;
        imagenPreview.value = null;

        idSeleccionado.value = null;
        modoFormulario.value = 'crear';
    };

    const obtenerFServidores = async () => {
        try {
            servidores.value = await obtenerServidores()
        }catch (error) {
            console.error('Error al obtener los servidores:', error)
        }
    }

    const enviarFServidor = async() => {
        try {
            const formData = new FormData();
            formData.append('nombre_servidor', input_nombre_servidor.value);
            formData.append('estado', input_estado.value);
            formData.append('ip', input_ip.value);
            formData.append('description', input_description.value);

            // 👇 ESTO ES LO MÁS IMPORTANTE
            if (imagenFile.value) formData.append('imagen', imagenFile.value);
            
            let data;

            // Modo Crear y Editar

            if (modoFormulario.value === 'crear') {
                // POST
                if (!imagenFile.value) {
                    alert('Falta la imagen')
                    return
                }
                
                const postear = await crearServidor(formData)
                console.log('Enviado correctamente:', postear);

                // Agregar a la lista local
                servidores.value.push(postear)
            } else {

                if (!idSeleccionado.value) {
                    console.error("No hay ID seleccionada")
                    return
                }

                const edicionServidor = await editarServidor(idSeleccionado.value, formData)

                // Actualizar la lista local de forma reactiva
                const index = servidores.value.findIndex(s => s.id === idSeleccionado.value)
                if ( index !== -1) {
                    servidores.value.splice(index, 1, edicionServidor)
                }
            }
            // Resetear formulario
            resetFormulario();
        } catch (error) {
            console.error('Error al enviar formulario', error);
        }
    }

    const editarFServidor = (servidor: servidores) => {
        try{
            // Llenar inputs
            input_nombre_servidor.value = servidor.nombre_servidor;
            input_estado.value = servidor.estado;
            input_ip.value = servidor.ip;
            input_description.value = servidor.description;
            imagenPreview.value = `http://localhost:4000${servidor.imagen}`;
            imagenFile.value = null; // Solo si quiere reemplazar

            // Cambiar modo a editar
            idSeleccionado.value = servidor.id;
            modoFormulario.value = 'editar';
        } catch (error){
            console.error('Error al editar el formulario', error);
        }
        
    }

    const eliminarFServidor = async(id:number) => {
        const confirmar = confirm('¿Seguro que quieres eliminar este servidor?');
        if (!confirmar) return;

        try {
            await eliminarServidor(id)

            // quitar de la lista sin volver a pedir todo
            servidores.value = servidores.value.filter(
                servidor => servidor.id !== id
            );
        } catch (error) {
            console.error('Error al eliminar servidor', error);
            alert('No se pudo eliminar el servidor');
        }
    }

    return {
        input_nombre_servidor,
        input_estado,
        input_ip,
        input_description,
        imagenPreview,
        servidores,
        idSeleccionado,
        modoFormulario,
        onFileChange,
        resetFormulario,
        obtenerFServidores,
        enviarFServidor,
        editarFServidor,
        eliminarFServidor
    }
}