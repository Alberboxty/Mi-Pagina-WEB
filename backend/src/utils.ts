import { newDiaryEntry, Weather, Visibility} from "./types";

const parseComment = (commentFromRequest: any): string => {
    if (!isString(commentFromRequest)) {
        throw new Error('Incorrecto o comentario invalido')
    }

    return commentFromRequest
}

const parseDate = (dateFromRequest: any): string => {
    if (!isString(dateFromRequest) || !isDate(dateFromRequest)) {
        throw new Error('Incorrecto o fecha invalida')
    }
    return dateFromRequest
}

const parseWeather = (weatherFromRequest: any): Weather => {
    if (!isString(weatherFromRequest) || !isWeather(weatherFromRequest)) {
        throw new Error('Incorrecto o tiempo invalido')
    }
    return weatherFromRequest
}

const parseVisibility = (visibilityFromRequest: any): Visibility => {
    if (!isString(visibilityFromRequest) || !isVisibility(visibilityFromRequest)) {
        throw new Error('Incorrecto o visibilidad invalido')
    }
    return visibilityFromRequest
}

const isString = (string: string): boolean => {
    return typeof string == 'string'
}

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date))
}

const isWeather = (param: any): boolean => {
    return Object.values(Weather).includes(param)
}

const isVisibility = (param: any): boolean => {
    return Object.values(Visibility).includes(param)
}

const toNewDiaryEntry = (object: any): newDiaryEntry => {
    const newEntry: newDiaryEntry = {
        comment: parseComment(object.comment),
        date: parseDate(object.date),
        weather: parseWeather(object.weather),
        visibility: parseVisibility(object.visibility)

        // ...
    }
    return newEntry
}

export default toNewDiaryEntry