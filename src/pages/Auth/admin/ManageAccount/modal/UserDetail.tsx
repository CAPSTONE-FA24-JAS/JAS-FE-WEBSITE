import { Modal } from 'antd'
import { AdminGetListUserChildrenResponse } from '../../../../../types/Account.type'

const UserDetail = ({
  visible,
  onClose,
  user
}: {
  visible: boolean
  onClose: () => void
  user: AdminGetListUserChildrenResponse | null
}) => {
  if (!user) return null

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={600} title='Detail User'>
      <div className='flex'>
        <div className='w-1/3'>
          <img
            src={user.profilePicture || 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
            alt={user.firstName + ' ' + user.lastName}
            className='object-cover w-full rounded-lg'
          />
        </div>
        <div className='w-2/3 pl-6'>
          <InfoItem label='First Name:' value={user.firstName} />
          <InfoItem label='Last Name:' value={user.firstName} />
          <InfoItem label='Gender:' value={user.gender} />
          <InfoItem label='Phone Number:' value={user?.phoneNumber || NaN} />
          <InfoItem label='Email:' value={user.email} />
          <InfoItem label='Address Line:' value={user.address} />
          <InfoItem label='Role:' value={user.roleId} />
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
