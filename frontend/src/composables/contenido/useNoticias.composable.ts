import { ref } from 'vue'

import type { noticias } from '@/types/noticias.types'

import {
    obtenerNoticias,
    crearNoticia,
    editarNoticia,
    eliminarNoticia
} from '@/api/contenido/noticias.api'

const imagenFile = ref<File | null>(null)
const imagenPreview = ref<string | null>(null)

const input_Titulo = ref<string>('')
const input_Asunto = ref<string>('')
const input_Descripcion = ref<string>('')
const input_Version = ref<string>('')

const modoFormularioNews = ref<'crear' | 'editar'>('crear');

const idNewsSeleccionado = ref<number | null>(null);

export function useNoticias() {
    
    const noticias = ref<noticias[]>([])

    const onFileChange = (event: Event) => {
        const input = event.target as HTMLInputElement

        if (input.files && input.files.length > 0) {
            const file = input.files[0]

            imagenFile.value = file              // 👈 ARCHIVO REAL
            imagenPreview.value = URL.createObjectURL(file) // 👈 PREVIEW
        }
    }

    const resetNewsFormulario = () => {
        input_Titulo.value = '';
        input_Asunto.value = '';
        input_Descripcion.value = '';
        input_Version.value = '';
        imagenFile.value = null;
        imagenPreview.value = null;

        idNewsSeleccionado.value = null;
        modoFormularioNews.value = 'crear';
    };

    const obtenerFNoticias = async () => {
        try {
            noticias.value = await obtenerNoticias()
        }catch (error) {
            console.error('Error al obtener los servidores:', error)
        }
    }

    const enviarFNoticia = async() => {
        try {
            const formData = new FormData();
            if (imagenFile.value) formData.append('imagen', imagenFile.value);
            formData.append('titulo', input_Titulo.value);
            formData.append('asunto', input_Asunto.value);
            formData.append('descripcion', input_Descripcion.value);
            formData.append('version', input_Version.value);
                    
            // Modo Crear y Editar

            if (modoFormularioNews.value === 'crear') {
                // POST
                if (!imagenFile.value) {
                    alert('Falta la imagen')
                    return
                }
                
                const postear = await crearNoticia(formData)
                console.log('Enviado correctamente:', postear);

                // Agregar a la lista local
                noticias.value.push(postear)
            } else {

                if (!idNewsSeleccionado.value) {
                    console.error("No hay ID seleccionada")
                    return
                }

                const edicionServidor = await editarNoticia(idNewsSeleccionado.value, formData)

                // Actualizar la lista local de forma reactiva
                const index = noticias.value.findIndex(s => s.id === idNewsSeleccionado.value)
                if ( index !== -1) {
                    noticias.value.splice(index, 1, edicionServidor)
                }
            }
            // Resetear formulario
            resetNewsFormulario();
        } catch (error) {
            console.error('Error al enviar formulario', error);
        }
    }

    const editarFNoticia = (noticia: noticias) => {
        try{
            // Llenar inputs
            imagenPreview.value = `http://localhost:4000${noticia.imagen}`;
            imagenFile.value = null; // Solo si quiere reemplazar
            input_Titulo.value = noticia.titulo;
            input_Asunto.value = noticia.asunto;
            input_Descripcion.value = noticia.descripcion;
            input_Version.value = noticia.version;
            
            

            // Cambiar modo a editar
            idNewsSeleccionado.value = noticia.id;
            modoFormularioNews.value = 'editar';
        } catch (error){
            console.error('Error al editar el formulario', error);
        }
        
    }

    const eliminarFNoticia = async(id:number) => {
            const confirmar = confirm('¿Seguro que quieres eliminar esta noticia?');
            if (!confirmar) return;
    
            try {
                await eliminarNoticia(id)
    
                // quitar de la lista sin volver a pedir todo
                noticias.value = noticias.value.filter(
                    noticia => noticia.id !== id
                );
            } catch (error) {
                console.error('Error al eliminar la noticia', error);
                alert('No se pudo eliminar la noticia');
            }
        }

    return {
        imagenPreview,
        input_Titulo,
        input_Asunto,
        input_Descripcion,
        input_Version,
        modoFormularioNews,
        idNewsSeleccionado,
        noticias,
        onFileChange,
        resetNewsFormulario,
        obtenerFNoticias,
        enviarFNoticia,
        editarFNoticia,
        eliminarFNoticia
    }

}