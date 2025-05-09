import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            return state
        },
    },
})

export const { setUser } = userSlice.actions

export const currentUser = state => state.user

export const hasRole = role => state=> {
    return state.user?.role?.slug === role;
}
export const hasPermission = permission => state=> {
    return state.user?.permissions?.find(p=>p.code === permission);
}
export default userSlice.reducer