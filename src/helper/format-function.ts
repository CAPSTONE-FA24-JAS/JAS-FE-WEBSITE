export const currencyFormat = (amount: number, options: Intl.NumberFormatOptions = {}) => {
  return new Intl.NumberFormat('vi-VN', {
    // Sử dụng mã ngôn ngữ vi-VN cho VND
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    useGrouping: true,
    notation: 'standard',
    ...options
  }).format(amount)
}
