import { Modal } from 'antd'
import { AccountData } from '../../../../../types/Account.type'

const UserDetail = ({
  visible,
  onClose,
  user
}: {
  visible: boolean
  onClose: () => void
  user: AccountData | null
}) => {
  if (!user) return null

  const isCustomer = user.roleName === 'Customer'
  const profileData = isCustomer ? user.customerDTO : user.staffDTO

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={600} title='Detail User'>
      <div className='flex'>
        <div className='w-1/3'>
          <img
            src={profileData?.profilePicture || 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
            alt={`${profileData?.firstName} ${profileData?.lastName}`}
            className='object-cover w-full rounded-lg'
          />
        </div>
        <div className='w-2/3 pl-6'>
          <InfoItem label='First Name:' value={profileData?.firstName || 'N/A'} />
          <InfoItem label='Last Name:' value={profileData?.lastName || 'N/A'} />
          <InfoItem label='Gender:' value={profileData?.gender || 'N/A'} />
          <InfoItem label='Phone Number:' value={user.phoneNumber || 'N/A'} />
          <InfoItem label='Email:' value={user.email || 'N/A'} />
          <InfoItem label='Role:' value={user.roleName} />

          {isCustomer && user.customerDTO && (
            <>
              <InfoItem label='Address:' value={user.customerDTO.address || 'N/A'} />
              <InfoItem label='Citizen ID:' value={user.customerDTO.citizenIdentificationCard || 'N/A'} />
              <InfoItem
                label='Price Limit:'
                value={user.customerDTO.priceLimit ? `${user.customerDTO.priceLimit.toLocaleString()} VND` : 'N/A'}
              />
              {user.customerDTO.walletDTO && (
                <InfoItem
                  label='Wallet Balance:'
                  value={`${user.customerDTO.walletDTO.balance.toLocaleString()} VND`}
                />
              )}
            </>
          )}

          {!isCustomer && user.staffDTO && (
            <InfoItem label='Date of Birth:' value={new Date(user.staffDTO.dateOfBirth).toLocaleDateString()} />
          )}
        </div>
      </div>
    </Modal>
  )
}

const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className='mb-2'>
    <span className='text-gray-500'>{label}</span> <span className='font-medium'>{value}</span>
  </div>
)

export default UserDetail
