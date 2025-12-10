export enum Weather {
    Soleado = 'Soleado',
    Nublado = 'Nublado',
    Lluvioso = 'Lluvioso',
    ParcialmenteSoleado = 'Parcialmente soleado',
    ParcialmenteNublado = 'Parcialmente nublado'
}
export enum Visibility {
    Buena = 'Buena',
    Moderada = 'Moderada',
    Baja = 'Baja',
    Perfecta = 'Perfecta'
}

export interface DiaryEntry {
    id: number,
    date: string,
    weather: Weather,
    visibility: Visibility,
    comment: string

}



//export type NonSensitiveInfoDiaryEntry = Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>

export type NonSensitiveInfoDiaryEntry = Omit<DiaryEntry, "comment">
export type newDiaryEntry = Omit<DiaryEntry, 'id'>