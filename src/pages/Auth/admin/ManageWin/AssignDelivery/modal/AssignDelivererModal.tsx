import { Modal, Form, Select, Button, notification } from 'antd' // Import notification from Ant Design
import { useGetFilterByRoleQuery } from '../../../../../../services/account.services'
import { useEffect, useState } from 'react'
import { AdminGetFilterByRoleChildrenResponse } from '../../../../../../types/Account.type'
import { useAssignShipperMutation } from '../../../../../../services/invoice.services'

interface AssignDelivererModalProps {
  visible: boolean
  onCancel: () => void
  invoiceId: number | null // ID to fetch the invoice
  status: string
  setStatus: (status: string) => void
  refetch: () => void
}

const AssignDelivererModal: React.FC<AssignDelivererModalProps> = ({
  visible,
  onCancel,
  invoiceId,
  status,
  setStatus,
  refetch
}) => {
  const [form] = Form.useForm()
  const roleId = 6
  const [assignedStaff, setAssignedStaff] = useState<string>('')

  const [staffOptions, setStaffOptions] = useState<AdminGetFilterByRoleChildrenResponse[]>([])
  const { data: staffData, isLoading: staffLoading, error: staffError } = useGetFilterByRoleQuery(roleId)

  const [assignShipper, { isLoading: isAssigning }] = useAssignShipperMutation()

  useEffect(() => {
    if (staffData && staffData.data) {
      const staffList = staffData.data
      const extractedStaff = staffList.map((account: any) => account.staffDTO).filter(Boolean)
      setStaffOptions(extractedStaff)
    }
  }, [staffData])

  const handleStaffChange = (value: string) => {
    setAssignedStaff(value)
    setStatus('4') // Set status to 4 (Assigned)
  }

  const handleAssign = async () => {
    try {
      if (invoiceId) {
        // Call the API to assign the deliverer
        await assignShipper({
          invoiceId: invoiceId, // Use the passed invoiceId
          shipperId: parseInt(assignedStaff),
          status: 4 // Pass status 4 (Assigned)
        }).unwrap()

        notification.success({
          message: 'Success',
          description: 'Deliverer assigned successfully',
          placement: 'topRight'
        })

        onCancel() // Close the modal after assigning
        form.resetFields() // Reset the form
        refetch() // Refresh the data
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to assign deliverer',
        placement: 'topRight'
      })
      console.error('Error assigning deliverer:', error)
    }
  }

  return (
    <Modal
      title='Assign Deliverer'
      visible={visible}
      onCancel={onCancel}
      footer={null} // Customize the footer for form submission
    >
      <Form form={form} layout='vertical' onFinish={handleAssign}>
        <Form.Item
          label='Deliverer'
          name='deliverer'
          rules={[{ required: true, message: 'Please select a deliverer!' }]}
        >
          <Select value={assignedStaff} onChange={handleStaffChange} placeholder='Select staff'>
            {staffLoading ? (
              <Select.Option value='' disabled>
                Loading...
              </Select.Option>
            ) : staffError ? (
              <Select.Option value='' disabled>
                Error loading staff
              </Select.Option>
            ) : (
              staffOptions.map((staff) =>
                staff ? (
                  <Select.Option key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName}
                  </Select.Option>
                ) : null
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' loading={isAssigning}>
            Assign
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AssignDelivererModal
