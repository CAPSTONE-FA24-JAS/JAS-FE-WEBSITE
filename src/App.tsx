import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { adminRoutes, publicRoutes, staffARoutes, staffCRoutes } from './routes/routes'
import { isMobile, isTablet } from 'react-device-detect'
import MobileMaintenance from './components/MobileMaintenance'
import ProtectedRoutes from './components/ProtectedRoutes'
import { RoleType } from './slice/authLoginAPISlice'

function App() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(isMobile || isTablet) // Sử dụng hàm isMobile và isTablet từ thư viện react-device-detect

  useEffect(() => {
    const handleResize = () => {
      // Không cần kiểm tra kích thước màn hình nữa, sử dụng hàm isMobile và isTablet từ thư viện react-device-detect để bắt thiết bị đăng nhập
      setIsMobileOrTablet(isMobile || isTablet)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup event listener on component unmount
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
                <Layout children={<Component />} />
                // <ProtectedRoutes allowedRoles={[RoleType.GUEST, RoleType.GUEST]} redirectPath='/login'>

                // </ProtectedRoutes>
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
                <Layout children={<Component />} />
                // <ProtectedRoutes allowedRoles={[RoleType.GUEST, RoleType.GUEST]} redirectPath='/login'>

                // </ProtectedRoutes>
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
                <Layout children={<Component />} />
                // <ProtectedRoutes allowedRoles={[RoleType.GUEST, RoleType.GUEST]} redirectPath='/login'>

                // </ProtectedRoutes>
              }
            />
          )
        })}
        {staffARoutes.map(({ layout, component, path }, index) => {
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
        })}
      </Routes>
    </>
  )
}

export default App
