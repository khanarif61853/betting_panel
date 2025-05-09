import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from "@/store/slices"
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { apis } from "@/store/apis";
import { instituteApi } from '@/store/apis/instituteApi';

const persistConfig = {
    key: "root",
    storage,
    blacklist:[apis.reducerPath]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck:false}).concat(apis.middleware,instituteApi.middleware),


})


export const persistor = persistStore(store)
