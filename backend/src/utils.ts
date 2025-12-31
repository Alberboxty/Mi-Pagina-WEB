import { ServidoresEntry, estadoServidor } from "./types";

const parsenombre_servidor = (nombre_servidorFromRequest: any): string => {
    if (!isString(nombre_servidorFromRequest)) {
        throw new Error('Incorrecto o nombre del servidor invalido')
    }

    return nombre_servidorFromRequest
}

const parseEstado = (estadoFromRequest: any): estadoServidor => {
    if (!isString(estadoFromRequest) || !isEstado(estadoFromRequest)) {
        throw new Error('Incorrecto o estado invalido')
    }
    return estadoFromRequest
}

const isEstado = (param: any): boolean => {
    return Object.values(estadoServidor).includes(param)
}

const parseIp = (ipFromRequest: any): string => {
    if (!isString(ipFromRequest)) {
        throw new Error('Incorrecto o IP invalida')
    }

    return ipFromRequest
}

const parseImagen = (imagenFromRequest: any): string => {
    if (!isString(imagenFromRequest)) {
        throw new Error('Incorrecto o imagen invalida')
    }

    return imagenFromRequest
}

const parseDescription = (descriptionFromRequest: any): string => {
    if (!isString(descriptionFromRequest)) {
        throw new Error('Incorrecto o descripción invalida')
    }

    return descriptionFromRequest
}

const parseDate = (dateFromRequest: any): string => {
    if (!isString(dateFromRequest) || !isDate(dateFromRequest)) {
        throw new Error('Incorrecto o fecha invalida')
    }
    return dateFromRequest
}

const isString = (string: string): boolean => {
    return typeof string == 'string'
}

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date))
}



const toNewServidoresEntry = (object: any): ServidoresEntry => {
    const newEntry: ServidoresEntry = {
        nombre_servidor: parsenombre_servidor(object.nombre_servidor),
        estado: parseEstado(object.estado),
        ip: parseIp(object.ip),
        imagen: parseImagen(object.imagen),
        description: parseDescription(object.description),
        date: parseDate(object.date)

        // ...
    }
    return newEntry
}

export default toNewServidoresEntry