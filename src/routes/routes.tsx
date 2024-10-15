import ClientLayout from '../layout/client_layout/ClientLayout'
import LoginLayout from '../layout/login_layout/LoginLayout'
import StaffLayout from '../layout/staff_layout/StaffLayout'
import AuctionList from '../pages/Auth/admin/Auction/AuctionList'
import LotList from '../pages/Auth/admin/Lot/LotList'
import ManageWinList from '../pages/Auth/admin/ManageWin/ManageWinList'
import RequestConsign from '../pages/Auth/admin/RequestConsign/RequestConsign'
import LoginPage from '../pages/Auth/login/LoginPage'
import ConsignList from '../pages/Auth/staff/Consign/ConsignList'
import FinanceProofList from '../pages/Auth/staff/FinanceProof/FinanceProofList'
import ValuationTabs from '../pages/Auth/staff/Valuation/ValuationList'
import LotDetail from '../pages/clientPages/DetailLot'
import HomePage from '../pages/clientPages/Homepage'
import Lots from '../pages/clientPages/Lots'
import PastAuction from '../pages/clientPages/PastAuction'
import { RoleType } from '../slice/authLoginAPISlice'
import CreateAuthorization from '../pages/Auth/staff/Valuation/AuthorizationLetter'
import RequestPreliminaryList from '../pages/Auth/appraiser/RequestPreliminaryValuation/RequestPreliminaryValuation'
import AppraiserLayout from '../layout/appraiser_layout/AppraiserLayout'
import MyMissionList from '../pages/Auth/staff/Mission/MyMission'
import CreatePreliminaryValuationAppraiser from '../pages/Auth/appraiser/RequestPreliminaryValuation/CreatePreliminaryValuation'
import PreliminaryValuationList from '../pages/Auth/appraiser/Valuation/PreliminaryValuation/PreliminaryValuationList'
import CreateFinalValuation from '../pages/Auth/appraiser/Valuation/PreliminaryValuation/FinalValuation/modal/CreateFinalValuation'
import FinalValuationList from '../pages/Auth/appraiser/Valuation/PreliminaryValuation/FinalValuation/FinalValuationList'
import ManagerLayout from '../layout/admin_layout/ManagerLayout'
import AdminLayout from '../layout/manager_layout/AdminLayout'
import Overview from '../pages/Auth/manager/Overview'
import ManageAccount from '../pages/Auth/manager/ManageAccount/AccountList'
import CreateAccount from '../pages/Auth/manager/ManageAccount/CreateAccount'
import Index from '../pages/Auth/staff/Mission/LiveBidding'

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
const managerRoutes: RouteProps[] = [
  { path: '/manager/ConsignList', component: RequestConsign, layout: ManagerLayout },
  { path: '/manager/managewin', component: ManageWinList, layout: ManagerLayout },
  { path: '/manager/auctionlist', component: AuctionList, layout: ManagerLayout },
  { path: '/manager/lotlist', component: LotList, layout: ManagerLayout }
]
const appraiserRoutes: RouteProps[] = [
  { path: '/appraiser/requestConsign', component: RequestPreliminaryList, layout: AppraiserLayout },
  { path: '/appraiser/createPreliminary/:id', component: CreatePreliminaryValuationAppraiser, layout: AppraiserLayout },
  { path: '/appraiser/preliminaryList', component: PreliminaryValuationList, layout: AppraiserLayout },
  { path: '/appraiser/createPreliminary/:id', component: CreatePreliminaryValuationAppraiser, layout: AppraiserLayout },
  { path: '/appraiser/createFinal/:id', component: CreateFinalValuation, layout: AppraiserLayout },
  { path: '/appraiser/finalList', component: FinalValuationList, layout: AppraiserLayout }
]
const adminRoutes: RouteProps[] = [
  { path: '/admin/overview', component: Overview, layout: AdminLayout },
  { path: '/admin/AccountList', component: ManageAccount, layout: AdminLayout },
  { path: '/admin/createAccount', component: CreateAccount, layout: AdminLayout }
]

const staffCRoutes: RouteProps[] = [
  { path: '/staff/requestPreliminary', component: RequestPreliminaryList, layout: StaffLayout },
  { path: '/staff/ConsignList', component: ConsignList, layout: StaffLayout },
  { path: '/staff/valuationList', component: ValuationTabs, layout: StaffLayout },
  { path: '/staff/financeproof', component: FinanceProofList, layout: StaffLayout },
  { path: '/staff/auctionlist', component: AuctionList, layout: StaffLayout },
  { path: '/staff/authorization', component: CreateAuthorization, layout: StaffLayout },
  { path: '/staff/mymission', component: MyMissionList, layout: StaffLayout },
  { path: '/staff/livebidding', component: Index, layout: StaffLayout }
]

export { publicRoutes, managerRoutes, staffCRoutes, appraiserRoutes, adminRoutes }
