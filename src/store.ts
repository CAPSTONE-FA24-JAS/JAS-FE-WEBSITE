import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authLoginAPISlice from './slice/authLoginAPISlice'
import { authApi } from './services/auth.services'
import { consignApi } from './services/requestconsign.services'
import { accountApi } from './services/account.services'
import { valuationApi } from './services/valuation.services'
import { createNewStaff } from './services/createAccountStaff.service'
import { auctionApi } from './services/auction.service'

// Tạo cấu hình persist
export const persistConfig = {
  timeout: 100, // đỡ cái đoạn F5 chờ lâu quá :V thêm preloading sau thì setlaij default
  key: 'root',
  storage: storage,
  whitelist: ['authLoginAPI']
}

// Tạo rootReducer
const rootReducer = combineReducers({
  authLoginAPI: authLoginAPISlice,
  [authApi.reducerPath]: authApi.reducer,
  [consignApi.reducerPath]: consignApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [valuationApi.reducerPath]: valuationApi.reducer,
  [createNewStaff.reducerPath]: createNewStaff.reducer,
  [auctionApi.reducerPath]: auctionApi.reducer
  // Thêm các reducers khác nếu cần
})

// Tạo persistedReducer
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
})

// Định nghĩa loại cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Tạo persistor
export const persistor = persistStore(store)
