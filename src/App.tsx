import { useEffect, useState } from 'react'
import { isMobile, isTablet } from 'react-device-detect'
import { pdfjs } from 'react-pdf'
import { Route, Routes } from 'react-router-dom'
import MobileMaintenance from './components/MobileMaintenance'
import ProtectedRoutes from './components/ProtectedRoutes'
import { adminRoutes, publicRoutes, staffCRoutes } from './routes/routes'
import { RoleType } from './slice/authLoginAPISlice'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

function App() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(isMobile || isTablet) // Sử dụng hàm isMobile và isTablet từ thư viện react-device-detect

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(isMobile || isTablet)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (isMobileOrTablet) return <MobileMaintenance />
  return (
    <>
      <Routes>
        {publicRoutes.map(({ layout, component, path }, index) => {
          const Layout = layout
          const Component = component
          return (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoutes allowedRoles={[RoleType.GUEST, RoleType.CUSTOMER]} redirectPath='/login'>
                  <Layout children={<Component />} />
                </ProtectedRoutes>
              }
            />
          )
        })}

        {adminRoutes.map(({ layout, component, path }, index) => {
          const Layout = layout
          const Component = component
          return (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoutes allowedRoles={[RoleType.ADMIN]} redirectPath='/*'>
                  <Layout children={<Component />} />
                </ProtectedRoutes>
              }
            />
          )
        })}

        {staffCRoutes.map(({ layout, component, path }, index) => {
          const Layout = layout
          const Component = component
          return (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoutes allowedRoles={[RoleType.STAFFC]} redirectPath='/*'>
                  <Layout children={<Component />} />
                </ProtectedRoutes>
              }
            />
          )
        })}
        {/* {staffARoutes.map(({ layout, component, path }, index) => {
          const Layout = layout
          const Component = component
          return (
            <Route
              key={index}
              path={path}
              element={
                <Layout children={<Component />} />
                // <ProtectedRoutes allowedRoles={[RoleType.GUEST, RoleType.GUEST]} redirectPath='/login'>

                // </ProtectedRoutes>
              }
            />
          )
        })} */}
      </Routes>
    </>
  )
}

export default App
