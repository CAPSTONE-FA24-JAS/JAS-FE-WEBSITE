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
      <div className='py-4 mt-4'>{children}</div>
      <Footer />
    </>
  )
}
