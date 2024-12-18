import { Row, Col, Space } from 'antd'
import { ReactElement } from 'react'
import SaleInfoCards from './SaleInfoSection/SaleInfoCards'
import RevenueChart from './Revenue/Revenue'

export default function Dashboard(): ReactElement {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <SaleInfoCards />
      </Col>

      <Col span={24}>
        <RevenueChart />
      </Col>

      {/* <Col span={24}>
        <TopProducts />
      </Col> */}

      {/* Optional Space */}
      <Col xs={24} lg={8}>
        <Space direction='vertical' style={{ width: '100%' }} size={16}></Space>
      </Col>
    </Row>
  )
}
