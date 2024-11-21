import dayjs, { Dayjs } from 'dayjs'
import { LotDetail } from '../types/Lot.type'

// Chuyển đổi từ string sang Dayjs
export const stringToDate = (dateString: string): Dayjs => {
  return dayjs(dateString)
}

// Chuyển đổi từ Dayjs sang string
export const dateToString = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD')
}

export const parseDate = (dateString: string, type: 'dd/mm/yyyy' | 'dd/mm/yyy hh/mm/ss'): string => {
  if (!dateString) {
    return ''
  }
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const gmt = -(date.getTimezoneOffset() / 60)
  if (type === 'dd/mm/yyy hh/mm/ss') {
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} GMT: ${gmt}`
  }

  return `${day}/${month}/${year}`
}

export const convertArrayImages = (item: LotDetail): string[] => {
  const images: string[] = []

  if (item.jewelry) {
    if (item.jewelry.imageJewelries) {
      images.push(...item.jewelry.imageJewelries.map((img) => img.imageLink))
    }
    if (item.jewelry.mainDiamonds) {
      item.jewelry.mainDiamonds.forEach((diamond) => {
        if (diamond.imageDiamonds) {
          images.push(...diamond.imageDiamonds.map((img) => img.imageLink))
        }
      })
    }
    if (item.jewelry.secondaryDiamonds) {
      item.jewelry.secondaryDiamonds.forEach((diamond) => {
        if (diamond.imageDiamonds) {
          images.push(...diamond.imageDiamonds.map((img) => img.imageLink))
        }
      })
    }

    if (item.jewelry.mainShaphies) {
      item.jewelry.mainShaphies.forEach((shaphy) => {
        if (shaphy.imageShaphies) {
          images.push(...shaphy.imageShaphies.map((img) => img.imageLink))
        }
      })
    }

    if (item.jewelry.secondaryShaphies) {
      item.jewelry.secondaryShaphies.forEach((saphy) => {
        if (saphy.imageShaphies) {
          images.push(...saphy.imageShaphies.map((img) => img.imageLink))
        }
      })
    }
  }

  return images.filter(Boolean) // loại bỏ các thành phần rỗng hoặc undefined null ""
}

export const parsePriceVND = (price: number) => {
  if (!price) {
    return price
  }
  if (typeof price === 'string') {
    return Number(price).toLocaleString('en-US', { style: 'currency', currency: 'VND' })
  }
  return price.toLocaleString('en-US', { style: 'currency', currency: 'VND' })
}
