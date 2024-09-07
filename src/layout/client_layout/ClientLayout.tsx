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
      <div className='mt-4 py-4'>{children}</div>
      <Footer />
    </>
  )
}
