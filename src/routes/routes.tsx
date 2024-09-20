import AdminLayout from '../layout/admin_layout/AdminLayout'
import ClientLayout from '../layout/client_layout/ClientLayout'
import LoginLayout from '../layout/login_layout/LoginLayout'
import StaffLayout from '../layout/staff_layout/StaffLayout'
import ManageAccount from '../pages/Auth/admin/ManageAccount/AccountList'
import CreateAccount from '../pages/Auth/admin/ManageAccount/CreateAccount'
import Overview from '../pages/Auth/admin/ManageAccount/OverView'
import RequestConsign from '../pages/Auth/admin/RequestConsign/RequestConsign'
import LoginPage from '../pages/Auth/login/LoginPage'
import ConsignList from '../pages/Auth/staff/Consign/ConsignList'
import FinanceProofList from '../pages/Auth/staff/FinanceProof/FinanceProofList'
import CreatePreliminaryValuation from '../pages/Auth/staff/Valuation/CreatePreliminary'
import ValuationTabs from '../pages/Auth/staff/Valuation/ValuationList'
import LotDetail from '../pages/clientPages/DetailLot'
import HomePage from '../pages/clientPages/Homepage'
import Lots from '../pages/clientPages/Lots'
import PastAuction from '../pages/clientPages/PastAuction'
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
  { path: '/login', component: LoginPage, layout: LoginLayout },
  { path: '/pastauction', component: PastAuction, layout: ClientLayout },
  { path: '/lotslist', component: Lots, layout: ClientLayout },
  { path: '/detaillot/:id', component: LotDetail, layout: ClientLayout }
]
const adminRoutes: RouteProps[] = [
  { path: '/admin/', component: Overview, layout: AdminLayout },
  { path: '/admin/overview', component: Overview, layout: AdminLayout },
  { path: '/admin/AdminConsignList', component: RequestConsign, layout: AdminLayout },
  { path: '/admin/AccountList', component: ManageAccount, layout: AdminLayout },
  { path: '/admin/createAccount', component: CreateAccount, layout: AdminLayout }
]
const staffCRoutes: RouteProps[] = [
  { path: '/staff/', component: ConsignList, layout: StaffLayout },
  { path: '/staff/ConsignList', component: ConsignList, layout: StaffLayout },
  { path: '/staff/valuationList', component: ValuationTabs, layout: StaffLayout },
  { path: '/staff/addPreliminary/:id', component: CreatePreliminaryValuation, layout: StaffLayout },
  { path: '/staff/financeproof', component: FinanceProofList, layout: StaffLayout }
]

export { publicRoutes, adminRoutes, staffCRoutes }
