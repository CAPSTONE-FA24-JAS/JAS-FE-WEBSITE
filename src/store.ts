import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authLoginAPISlice from './slice/authLoginAPISlice'
import { authApi } from './services/auth.services'

// Tạo cấu hình persist
export const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['authLoginAPI']
}

// Tạo rootReducer
const rootReducer = combineReducers({
  authLoginAPI: authLoginAPISlice,
  [authApi.reducerPath]: authApi.reducer
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
    }).concat(authApi.middleware) // Đảm bảo rằng middleware của `authApi` được thêm đúng
})

// Định nghĩa loại cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Tạo persistor
export const persistor = persistStore(store)
