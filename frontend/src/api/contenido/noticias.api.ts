import axios from 'axios'

import type { noticias } from '@/types/noticias.types'

const API = "http://localhost:4000/admin/noticias"

export const obtenerNoticias = async (): Promise<noticias[]> => {
    const res = await axios.get(
        API
        , {withCredentials: true}
    )
    return res.data
}

export const crearNoticia = async ( formData: FormData ): Promise<noticias> => {
    const res = await axios.post(
        API
        , formData
        , {withCredentials: true}
    )
    return res.data
}

export const editarNoticia = async ( id: number, formData: FormData ): Promise<noticias> => {
    const res = await axios.patch(`${API}/${id}`
        , formData
        , {withCredentials: true}
    )
    return res.data
}

export const eliminarNoticia = async ( id: number ) => {
    const res = await axios.delete(
        `${API}/${id}`
        , {withCredentials: true}
    )
}