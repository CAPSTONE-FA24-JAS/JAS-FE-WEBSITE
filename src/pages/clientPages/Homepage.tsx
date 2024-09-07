import { Layout, Typography } from 'antd'

const { Header, Content, Footer } = Layout
const { Title, Paragraph } = Typography

export default function HomePage() {
  return (
    <Layout>
      <Content>
        <Title>Welcome to the Jewelry Auction</Title>
        <Paragraph>
          Discover exquisite jewelry pieces and participate in exciting auctions. Explore our wide range of stunning
          jewelry and find the perfect piece for you.
        </Paragraph>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Jewelry Auction ©2024 Created by Your Company</Footer>
    </Layout>
  )
}
