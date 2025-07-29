import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        // UI State
        showpassword: false,
        
        // Authentication State
        isAuthenticated: !!localStorage.getItem('token'),
        token: localStorage.getItem('token') || null,
        user: null,
        
        // Form Data
        loginForm: {
            email: '',
            password: '',
        },
        registerForm: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            branch: '',
            whatsapp: ''
        },
        
        // OTP Verification Data
        otpData: {
            email: '',
            password: '',
            otp: Array(6).fill("")
        },
        
        // User Profile
        profile: {
            name: '',
            email: '',
            branch: '',
            whatsapp: '',
            profileImage: null
        }
    },
    reducers: {
        // UI Actions
        SetShowPassword: (state) => {
            state.showpassword = !state.showpassword
        },
        
        // Authentication Actions
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
            if (action.payload) {
                localStorage.setItem('token', action.payload)
            } else {
                localStorage.removeItem('token')
            }
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.token = null
            state.user = null
            localStorage.removeItem('token')
        },
        
        // Form Actions
        updateLoginForm: (state, action) => {
            state.loginForm = { ...state.loginForm, ...action.payload }
        },
        updateRegisterForm: (state, action) => {
            state.registerForm = { ...state.registerForm, ...action.payload }
        },
        resetLoginForm: (state) => {
            state.loginForm = { email: '', password: '' }
        },
        resetRegisterForm: (state) => {
            state.registerForm = {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                branch: '',
                whatsapp: ''
            }
        },
        
        // OTP Actions
        setOtpData: (state, action) => {
            state.otpData = { ...state.otpData, ...action.payload }
        },
        updateOtp: (state, action) => {
            state.otpData.otp = action.payload
        },
        resetOtpData: (state) => {
            state.otpData = {
                email: '',
                password: '',
                otp: Array(6).fill("")
            }
        },
        
        // Profile Actions
        setProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload }
        },
        updateProfileImage: (state, action) => {
            state.profile.profileImage = action.payload
        }
    },
})

export const { 
    SetShowPassword,
    setAuthenticated,
    setToken,
    setUser,
    logout,
    updateLoginForm,
    updateRegisterForm,
    resetLoginForm,
    resetRegisterForm,
    setOtpData,
    updateOtp,
    resetOtpData,
    setProfile,
    updateProfileImage
} = userSlice.actions

export default userSlice.reducer
