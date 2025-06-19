// utils/formatTime.ts
import dayjs from 'dayjs'

export const formatTime = (isoString: string) => {
    return dayjs(isoString).format('HH:mm') // formato 24h, o 'hh:mm A' para 12h con AM/PM
}
