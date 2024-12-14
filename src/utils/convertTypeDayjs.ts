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

export const parseDate = (
  dateString: string,
  type: 'dd/mm/yyyy' | 'dd/mm/yyyy hh:mm:ss' | 'dd/mm/yyyy hh:mm:ss:ttt'
): string => {
  if (!dateString) {
    return ''
  }

  if (type === 'dd/mm/yyyy hh:mm:ss:ttt') {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0') // Đảm bảo 2 chữ số
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Đảm bảo 2 chữ số
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0') // Đảm bảo 2 chữ số
    const minutes = date.getMinutes().toString().padStart(2, '0') // Đảm bảo 2 chữ số
    const seconds = date.getSeconds().toString().padStart(2, '0') // Đảm bảo 2 chữ số
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0') // Đảm bảo 3 chữ số

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}:${milliseconds}`
  }

  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0') // Đảm bảo 2 chữ số
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Đảm bảo 2 chữ số
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0') // Đảm bảo 2 chữ số
  const minutes = date.getMinutes().toString().padStart(2, '0') // Đảm bảo 2 chữ số
  const seconds = date.getSeconds().toString().padStart(2, '0') // Đảm bảo 2 chữ số

  if (type === 'dd/mm/yyyy hh:mm:ss') {
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
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
    return Number(price).toLocaleString('vi-vn', { style: 'currency', currency: 'VND' })
  }
  return price.toLocaleString('vi-vn', { style: 'currency', currency: 'VND' })
}
