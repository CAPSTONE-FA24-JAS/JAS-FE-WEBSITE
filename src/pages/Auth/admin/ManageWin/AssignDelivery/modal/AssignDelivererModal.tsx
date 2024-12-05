import { Button, Form, Modal, notification, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useGetFilterByRoleQuery } from '../../../../../../services/account.services'
import {
  useAssignShipperMutation,
  useGetDeliveringInvoicesByShipperQuery
} from '../../../../../../services/invoice.services'
import { AdminGetFilterByRoleChildrenResponse, AdminGetFilterByRoleData } from '../../../../../../types/Account.type'

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
  const [invoiceCountByShipper, setInvoiceCountByShipper] = useState<{ [key: number]: number }>({})

  const { data: staffData, isLoading: staffLoading, error: staffError } = useGetFilterByRoleQuery(roleId)

  const [assignShipper, { isLoading: isAssigning }] = useAssignShipperMutation()
  const shipperIds = staffData?.data.map((account: AdminGetFilterByRoleData) => account.staffDTO?.id).filter(Boolean)

  const { data: deliveringInvoices } = useGetDeliveringInvoicesByShipperQuery(shipperIds)

  useEffect(() => {
    if (staffData && staffData.data) {
      const staffList = staffData.data
      const extractedStaff = staffList.map((account: AdminGetFilterByRoleData) => account.staffDTO).filter(Boolean)
      setStaffOptions(extractedStaff)
    }
  }, [staffData])

  useEffect(() => {
    if (deliveringInvoices && deliveringInvoices.data && deliveringInvoices.data.dataResponse) {
      const countByShipper = deliveringInvoices.data.dataResponse.reduce((acc: any, invoice: any) => {
        const shipperId = invoice.shipperId
        if (shipperId) {
          acc[shipperId] = (acc[shipperId] || 0) + 1
        }
        return acc
      }, {})
      setInvoiceCountByShipper(countByShipper)
    } else {
      console.log('No delivering invoices data available')
    }
  }, [deliveringInvoices])

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
                        <strong>Delivering:</strong> {invoiceCountByShipper[staff.id] || 0}
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
