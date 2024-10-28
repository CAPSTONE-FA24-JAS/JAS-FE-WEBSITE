import dayjs, { Dayjs } from 'dayjs'

// Chuyển đổi từ string sang Dayjs
export const stringToDate = (dateString: string): Dayjs => {
  return dayjs(dateString)
}

// Chuyển đổi từ Dayjs sang string
export const dateToString = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD')
}

export const parseDate = (dateString: string, type: 'dd/mm/yyyy' | 'dd/mm/yyy hh/mm/ss'): string => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  if (type === 'dd/mm/yyy hh/mm/ss') {
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  return `${day}/${month}/${year}`
}
