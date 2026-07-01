import axios from 'axios'
import type { servidores } from '../../types/servidores.types'

//const API = "http://localhost:4000/api/servidores"
const API2 = "http://localhost:4000/admin/servidores"

export const obtenerServidores = async (): Promise<servidores[]> => {
    const res = await axios.get(
        API2
        , {withCredentials: true}
    )
    return res.data
}

export const crearServidor = async ( formData: FormData ): Promise<servidores> => {
    const res = await axios.post(
        API2
        , formData
        , {withCredentials: true}
    )
    return res.data
}

export const editarServidor = async ( id: number, formData: FormData ): Promise<servidores> => {
    const res = await axios.patch(`${API2}/${id}`
        , formData
        , {withCredentials: true}
    )
    return res.data
}

export const eliminarServidor = async ( id: number ) => {
    const res = await axios.delete(
        `${API2}/${id}`
        , {withCredentials: true}
    )
}

