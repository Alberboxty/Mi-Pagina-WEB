import { ServidoresEntry } from '../types'

import servidoresdata from './servidores.json'

const servidores: ServidoresEntry[] = servidoresdata as ServidoresEntry[]

export const getEntries = (): ServidoresEntry[] => servidores


// export const getEntriesmap = () => {
//     return servidores.map(({nombre_servidor, estado, ip, imagen, description, date}) => {
//         return {
//             nombre_servidor,
//             estado,
//             ip,
//             imagen,
//             description,
//             date
//         }
//     })
// }

// export const addDiary = (newDiaryEntry: newDiaryEntry): DiaryEntry => {
//     const newDiary = {
//         id: diaries.length + 1,
//         //id: Math.max( ... diaries.map(d => d.id)) + 1
//         ... newDiaryEntry
//     }
//     diaries.push(newDiary)
//     return newDiary
// }