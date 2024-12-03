import { Modal, Form, Select, Button, notification } from 'antd'
import { useGetFilterByRoleQuery } from '../../../../../../services/account.services'
import { useEffect, useState } from 'react'
import { AdminGetFilterByRoleChildrenResponse } from '../../../../../../types/Account.type'
import { useAssignShipperMutation, useShipperAndInvoiceQuery } from '../../../../../../services/invoice.services'

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
  setStatus,
  refetch
}) => {
  const [form] = Form.useForm()
  const roleId = 6
  const [assignedStaff, setAssignedStaff] = useState<string>('')
  const [staffOptions, setStaffOptions] = useState<AdminGetFilterByRoleChildrenResponse[]>([])

  // Query for staff and shipper data
  const { data: staffData, isLoading: staffLoading, error: staffError } = useGetFilterByRoleQuery(roleId)
  const { data } = useShipperAndInvoiceQuery(undefined, { skip: !invoiceId })
  const [assignShipper, { isLoading: isAssigning }] = useAssignShipperMutation()

  // Extract invoice count safely
  // const invoiceCount = Array.isArray(data?.invoiceCounts) ? data.invoiceCounts[0] || 0 : 0
  useEffect(() => {
    if (data) {
      console.log('Full response data:', data)
      const invoiceCounts = data.invoiceCounts || []
      console.log('Invoice counts array:', invoiceCounts)
      if (invoiceCounts.length > 0) {
        const invoiceCount = invoiceCounts[0] ?? 0
        console.log('Số lượng hóa đơn:', invoiceCount)
      } else {
        console.log('Không có hóa đơn nào')
      }
    }
  }, [data])

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
      open={visible}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {staff.firstName} {staff.lastName}
                      </span>
                      <span>
                        <strong>Invoice:</strong>{' '}
                        {Array.isArray(data?.invoiceCounts) && data.invoiceCounts.length > 0
                          ? data.invoiceCounts[0] ?? 'No Invoice'
                          : 'No Invoice'}
                      </span>
                    </div>
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
