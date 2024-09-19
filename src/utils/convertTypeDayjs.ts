import dayjs, { Dayjs } from 'dayjs'

// Chuyển đổi từ string sang Dayjs
export const stringToDate = (dateString: string): Dayjs => {
  return dayjs(dateString)
}

// Chuyển đổi từ Dayjs sang string
export const dateToString = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD')
}
