import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        showpassword: false,
    },
    reducers: {
        SetShowPassword: (state) => {
            state.showpassword = !state.showpassword
        },
    },
})

export const { SetShowPassword } = userSlice.actions
export default userSlice.reducer
