import ClientLayout from '../layout/client_layout/ClientLayout'
import LoginLayout from '../layout/login_layout/LoginLayout'
import LoginPage from '../pages/Auth/login/LoginPage'
import HomePage from '../pages/clientPages/Homepage'
import { RoleType } from '../slice/authLoginAPISlice'

interface LayoutProps {
  children: React.ReactNode
  requiredRole?: RoleType
  whenRoleUnAuthorized?: string
}

interface RouteProps {
  path: string
  component: () => JSX.Element
  layout: (children: LayoutProps) => JSX.Element
}
const publicRoutes: RouteProps[] = [
  { path: '/', component: HomePage, layout: ClientLayout },
  { path: '/login', component: LoginPage, layout: LoginLayout }
]
const adminRoutes: RouteProps[] = []
const staffRoutes: RouteProps[] = []
const manageRoutes: RouteProps[] = []

export { publicRoutes, adminRoutes, staffRoutes, manageRoutes }
