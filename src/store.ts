import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authLoginAPISlice from './slice/authLoginAPISlice'
import { authApi } from './services/auth.services'
import { consignApi } from './services/requestconsign.services'
import { accountApi } from './services/account.services'
import { valuationApi } from './services/valuation.services'
import { createNewStaff } from './services/createAccountStaff.services'
import { auctionApi } from './services/auction.services'
import { financeProofApi } from './services/financeProof.services'

import { bidType } from './services/bidtype.services'
import { createFinal } from './services/createfinalvaluation.services'

import { lotApi } from './services/lot.services'
import { jewelryApi } from './services/jewelry.services'
import { manageInvoice } from './services/invoice.services'
import { overviewApi } from './services/overview.services'
import { manageotherApi } from './services/manageother.services'
import { dashboardApi } from './services/dashboard.services'
import { notiApi } from './services/notification.services'

// Tạo cấu hình persist
export const persistConfig = {
  timeout: 200, // đỡ cái đoạn F5 chờ lâu quá :V thêm preloading sau thì setlaij default
  key: 'root',
  storage: storage,
  whitelist: ['authLoginAPI', 'selectedKey']
}

// Tạo rootReducer
const rootReducer = combineReducers({
  authLoginAPI: authLoginAPISlice,
  [authApi.reducerPath]: authApi.reducer,
  [consignApi.reducerPath]: consignApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [valuationApi.reducerPath]: valuationApi.reducer,
  [createNewStaff.reducerPath]: createNewStaff.reducer,
  [auctionApi.reducerPath]: auctionApi.reducer,
  [financeProofApi.reducerPath]: financeProofApi.reducer,

  [bidType.reducerPath]: bidType.reducer,
  [createFinal.reducerPath]: createFinal.reducer,

  [lotApi.reducerPath]: lotApi.reducer,
  [jewelryApi.reducerPath]: jewelryApi.reducer,
  [manageInvoice.reducerPath]: manageInvoice.reducer,
  [overviewApi.reducerPath]: overviewApi.reducer,
  [manageotherApi.reducerPath]: manageotherApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [notiApi.reducerPath]: notiApi.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Cấu hình store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
      .concat(authApi.middleware)
      .concat(consignApi.middleware)
      .concat(accountApi.middleware)
      .concat(valuationApi.middleware)
      .concat(createNewStaff.middleware)
      .concat(auctionApi.middleware)
      .concat(financeProofApi.middleware)

      .concat(bidType.middleware)
      .concat(createFinal.middleware)

      .concat(lotApi.middleware)
      .concat(jewelryApi.middleware)
      .concat(manageInvoice.middleware)
      .concat(overviewApi.middleware)
      .concat(manageotherApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(notiApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Tạo persistor
export const persistor = persistStore(store)
