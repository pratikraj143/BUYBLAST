import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import headerReducer from './headerSlice'

const appstore = configureStore({
    reducer: {
        user: userReducer,
        header: headerReducer,
    },
    devTools: true,
})

export default appstore 