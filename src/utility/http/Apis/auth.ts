import { LoginApiArgs } from '@src/utility/types/typeAuthApi'
import ApiEndpoints from '../ApiEndpoints'
import http from '../useHttp'

export const loginApi = (args: LoginApiArgs) => {
  http.request({
    ...args,
    method: 'post',
    path: ApiEndpoints.login,
    showErrorToast: true,
    authenticate: false
  })
}

export const loginOtpApi = (args: LoginApiArgs) => {
  http.request({
    ...args,
    method: 'post',
    path: ApiEndpoints.viaOTP,
    authenticate: false,

    showErrorToast: true
  })
}

export const logoutApi = (args: LoginApiArgs) => {
  http.request({
    ...args,
    method: 'post',
    path: ApiEndpoints.logout,
    authenticate: false,

    showErrorToast: true
  })
}

export const sendResetLinkApi = (args: LoginApiArgs) => {
  http.request({
    ...args,
    method: 'post',
    path: ApiEndpoints.forgotPassword,
    showErrorToast: true
  })
}

export const resetPasswordApi = (args: LoginApiArgs) => {
  http.request({
    ...args,
    method: 'post',
    path: ApiEndpoints.resetPassword,
    showErrorToast: true,
    showSuccessToast: true
  })
}

export const updatePasswordApi = (args: LoginApiArgs) => {
  http.request({
    ...args,
    method: 'post',
    path: ApiEndpoints.updatePassword,
    showErrorToast: true,
    showSuccessToast: true,
  })
}
