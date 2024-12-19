import ManagerLayout from '../layout/admin_layout/ManagerLayout'
import AppraiserLayout from '../layout/appraiser_layout/AppraiserLayout'
import ClientLayout from '../layout/client_layout/ClientLayout'
import LoginLayout from '../layout/login_layout/LoginLayout'
import AdminLayout from '../layout/manager_layout/AdminLayout'
import StaffLayout from '../layout/staff_layout/StaffLayout'
import AuctionList from '../pages/Auth/admin/Auction/AuctionList'
import Dashboard from '../pages/Auth/admin/Dashboard/Dashboard'
import FinanceProofListManager from '../pages/Auth/admin/FinanceProof/FinanceProofListManager'
import LotList from '../pages/Auth/admin/Lot/LotList'
import InvoiceTab from '../pages/Auth/admin/ManageWin/InvoiceTab'
import RequestConsign from '../pages/Auth/admin/RequestConsign/RequestConsign'
import RequestFinalValuation from '../pages/Auth/admin/RequestFinalValuation/RequestFinalValuation'
import TransactionsComponent from '../pages/Auth/admin/Transaction/Transaction'
import WithdrawalRequests from '../pages/Auth/admin/Withdraw/WithdrawList'
import CreatePreliminaryValuationAppraiser from '../pages/Auth/appraiser/RequestPreliminaryValuation/CreatePreliminaryValuation'
import RequestPreliminaryList from '../pages/Auth/appraiser/RequestPreliminaryValuation/RequestPreliminaryValuation'
import FinalValuationList from '../pages/Auth/appraiser/Valuation/PreliminaryValuation/FinalValuation/FinalValuationList'
import CreateFinalValuation from '../pages/Auth/appraiser/Valuation/PreliminaryValuation/FinalValuation/modal/CreateFinalValuation'
import PreliminaryValuationList from '../pages/Auth/appraiser/Valuation/PreliminaryValuation/PreliminaryValuationList'
import LoginPage from '../pages/Auth/login/LoginPage'
import ArtistList from '../pages/Auth/manager/Artist/ArtistList'
import BlogDetail from '../pages/Auth/manager/Blog/BlogDetail'
import BlogTable from '../pages/Auth/manager/Blog/BlogList'
import CategoriesComponent from '../pages/Auth/manager/Category/CategoryList'
import FloorFeeTable from '../pages/Auth/manager/FloorFee/FloorFeeTable'
import KeyCharacteristicComponent from '../pages/Auth/manager/KeyCharacteristic/KeyCharacteristicList'
import ManageAccount from '../pages/Auth/manager/ManageAccount/AccountList'
import CreateAccount from '../pages/Auth/manager/ManageAccount/CreateAccount'
import Overview from '../pages/Auth/manager/Overview'
import RequestConsignList from '../pages/Auth/staff/Consign/ConsignList'
import FinanceProofList from '../pages/Auth/staff/FinanceProof/FinanceProofList'
import { JewelryDetail } from '../pages/Auth/staff/Jewelry/JewelryDetail'
import JewelryList from '../pages/Auth/staff/Jewelry/JewelryList'
import Index from '../pages/Auth/staff/Mission/LiveBidding'
import CreateAuthorization from '../pages/Auth/staff/Valuation/AuthorizationLetter'
import ValuationTabs from '../pages/Auth/staff/Valuation/ValuationList'
import AboutUs from '../pages/clientPages/AboutUs'
import BlogDetailHome from '../pages/clientPages/Blog/BlogDetailHome'
import BlogHomepage from '../pages/clientPages/Blog/BlogHomePage'
import HomePage from '../pages/clientPages/Homepage'
import Lots from '../pages/clientPages/LotList/Lots'
import LotDetail from '../pages/clientPages/LotList/modal/DetailLot'
import PastAuctionMain from '../pages/clientPages/PastAuction/PastAuctionMain'
import UpComingMain from '../pages/clientPages/Upcoming/UpComingMain'
import { RoleType } from '../slice/authLoginAPISlice'

interface LayoutProps {
  children: React.ReactNode
  requiredRole?: RoleType
  whenRoleUnAuthorized?: string
}

interface RouteProps {
  path: string
  component: (props: any) => JSX.Element
  layout: (children: LayoutProps) => JSX.Element
}
const publicRoutes: RouteProps[] = [
  { path: '/', component: HomePage, layout: ClientLayout },
  { path: '/login', component: LoginPage, layout: LoginLayout },
  { path: '/pastauction', component: PastAuctionMain, layout: ClientLayout },
  { path: '//upcoming-auctions', component: UpComingMain, layout: ClientLayout },
  { path: '/lots/:auctionId', component: Lots, layout: ClientLayout },
  { path: '/blog', component: BlogHomepage, layout: ClientLayout },
  { path: '/blog/:id', component: BlogDetailHome, layout: ClientLayout },
  { path: '/detaillot/:id', component: LotDetail, layout: ClientLayout },
  { path: '/about', component: AboutUs, layout: ClientLayout }
]
const managerRoutes: RouteProps[] = [
  { path: '/manager/dashboard', component: Dashboard, layout: ManagerLayout },
  { path: '/manager/ConsignList', component: RequestConsign, layout: ManagerLayout },
  { path: '/manager/manageinvoice', component: InvoiceTab, layout: ManagerLayout },
  { path: '/manager/managewithdraw', component: WithdrawalRequests, layout: ManagerLayout },
  { path: '/manager/auctionlist', component: AuctionList, layout: ManagerLayout },
  { path: '/manager/requestfinal', component: RequestFinalValuation, layout: ManagerLayout },
  { path: '/manager/lotlist', component: LotList, layout: ManagerLayout },
  { path: '/manager/lotlist/:id', component: LotList, layout: ManagerLayout },
  { path: '/manager/financeProofManager', component: FinanceProofListManager, layout: ManagerLayout },
  { path: '/manager/transaction', component: TransactionsComponent, layout: ManagerLayout },
  { path: '/manager/lotdetailmanager/:id', component: Index, layout: ManagerLayout },
  { path: '/manager/jewelrys', component: JewelryList, layout: ManagerLayout },
  { path: '/manager/jewelry/:id', component: JewelryDetail, layout: ManagerLayout },
  { path: '/manager/bloglist', component: BlogTable, layout: ManagerLayout },
  { path: '/manager/blog/:id', component: BlogDetail, layout: ManagerLayout },
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
  { path: '/admin', component: Overview, layout: AdminLayout },
  { path: '/admin/overview', component: Overview, layout: AdminLayout },
  { path: '/admin/AccountList', component: ManageAccount, layout: AdminLayout },
  { path: '/admin/createAccount', component: CreateAccount, layout: AdminLayout },
  { path: '/admin/category', component: CategoriesComponent, layout: AdminLayout },
  { path: '/admin/artist', component: ArtistList, layout: AdminLayout },
  { path: '/admin/keyCharacteristic', component: KeyCharacteristicComponent, layout: AdminLayout },
  { path: '/admin/general', component: FloorFeeTable, layout: AdminLayout }

]

const staffCRoutes: RouteProps[] = [
  { path: '/staff/requestPreliminary', component: RequestPreliminaryList, layout: StaffLayout },
  { path: '/staff/ConsignList', component: RequestConsignList, layout: StaffLayout },
  { path: '/staff/valuationList', component: ValuationTabs, layout: StaffLayout },
  { path: '/staff/financeproof', component: FinanceProofList, layout: StaffLayout },
  { path: '/staff/auctionlist', component: AuctionList, layout: StaffLayout },
  { path: '/staff/authorization', component: CreateAuthorization, layout: StaffLayout },
  { path: '/staff/lotdetailmanager/:id', component: Index, layout: StaffLayout },
  { path: '/staff/lotlist/:id', component: LotList, layout: StaffLayout },
  { path: '/staff/managewithdraw', component: WithdrawalRequests, layout: StaffLayout },
  { path: '/staff/jewelrys', component: JewelryList, layout: StaffLayout },
  { path: '/staff/jewelry/:id', component: JewelryDetail, layout: StaffLayout }
]

export { adminRoutes, appraiserRoutes, managerRoutes, publicRoutes, staffCRoutes }
