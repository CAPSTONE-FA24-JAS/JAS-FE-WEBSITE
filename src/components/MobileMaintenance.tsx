export default function MobileMaintenance() {
  return (
    <div className='flex items-center justify-center h-screen bg-white'>
      <div className='text-center'>
        <div className='bg-gray-100 py-4'>
          <h1 className='text-2xl font-serif font-bold mb-4'>JAS xin lỗi bạn vì sự bất tiện này.</h1>
          <p className='mb-4 mx-4'>Hiện tại hệ thống đang phát triển để tương thích trên thiết bị di động.</p>
        </div>
        <img
          src='https://firebasestorage.googleapis.com/v0/b/voguary.appspot.com/o/Error_Page%2Fmaintenance_real.jpg?alt=media&token=b00756b8-d230-4ed3-a320-a1beba1e33e0'
          alt='Maintenance'
          className='mx-auto'
        />
      </div>
    </div>
  )
}
