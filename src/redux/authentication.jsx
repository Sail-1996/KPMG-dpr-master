// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'
import httpConfig from '@src/utility/http/httpConfig'

const config = useJwt.jwtConfig

const initialUser = () => {
  const item = window.localStorage.getItem(httpConfig.storageUserData)
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    updateAppName: (state, action) => {
      state.userData.app_name = action.payload.app_name
      state.userData.app_logo = action.payload.app_logo

    },
    handleLogin: (state, action) => {
      state.userData = action.payload
      state[httpConfig.storageTokenKeyName] = action.payload[httpConfig.storageTokenKeyName]
      state[httpConfig.storageRefreshTokenKeyName] =
        action.payload[httpConfig.storageRefreshTokenKeyName]
      localStorage.setItem(httpConfig.storageUserData, JSON.stringify(action.payload))
      localStorage.setItem(
        httpConfig.storageTokenKeyName,
        JSON.stringify(action.payload.accessToken)
      )
      localStorage.setItem(
        httpConfig.storageRefreshTokenKeyName,
        JSON.stringify(action.payload.refreshToken)
      )
    },
    handleLogout: (state) => {
      state.userData = {}
      state[httpConfig.storageTokenKeyName] = null
      state[httpConfig.storageRefreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem(httpConfig.storageUserData)
      localStorage.removeItem(httpConfig.storageTokenKeyName)
      localStorage.removeItem(httpConfig.storageRefreshTokenKeyName)
    }
  }
})

export const { handleLogin, handleLogout, updateAppName } = authSlice.actions

export default authSlice.reducer
