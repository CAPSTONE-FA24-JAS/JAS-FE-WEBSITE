import Header from './HeaderClient/Header'
import Footer from './FooterClient/Footer'

export interface ClientLayoutProps {
  children: React.ReactNode
  // Optional roles or additional props can be added here
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      <div className='pt-24'>{children}</div>
      <Footer />
    </>
  )
}
