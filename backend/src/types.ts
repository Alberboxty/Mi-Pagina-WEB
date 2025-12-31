export enum estadoServidor {
    Cerrado = 'Cerrado',
    Abierto = 'Abierto',
    Mantenimiento = 'Mantenimiento'
}

export interface ServidoresEntry {
    nombre_servidor: string,
    estado: estadoServidor,
    ip: string,
    imagen: string,
    description: string,
    date: string
}

//export type NonSensitiveInfoDiaryEntry = Omit<ServidoresEntry, "ip">