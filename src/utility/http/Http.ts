/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios'
import { entryPoint, Events } from '../Const'
import Emitter from '../Emitter'
import { ErrorToast, isValid, log, SuccessToast } from '../Utils'
import { default as defaultHttpConfig } from './httpConfig'

export interface RequestType extends AxiosRequestConfig {
  async?: boolean
  noEntryMode?: boolean
  showErrorToast?: boolean
  showSuccessToast?: boolean
  baseURL?: string
  method?: AxiosRequestConfig['method']
  path?: string
  jsonData?: any
  formData?: any
  authenticate?: boolean
  success?: (e: any) => void
  error?: (e: any) => void
  loading?: (e: any) => void
}

export default class HttpService {
  // ** apiConfig <= Will be used by this service
  httpConfig = { ...defaultHttpConfig }

  subscribers = []

  isAlreadyFetchingAccessToken = false

  constructor(httpConfigOverride: any) {
    this.httpConfig = { ...this.httpConfig, ...httpConfigOverride }
    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken =
          this.getToken() !== null || this.getToken() !== undefined
            ? JSON.parse(this.getToken())
            : null
        // log('accessToken', accessToken)
        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          //   log('auth test', accessToken, config)
          config.headers!.Authorization = `${this.httpConfig.tokenType} ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  //   onAccessTokenFetched(accessToken = () =>void) {
  //     this.subscribers = this.subscribers.filter((callback) => callback(accessToken))
  //   }

  //   addSubscriber(callback) {
  //     this.subscribers.push(callback)
  //   }
  getToken(): any {
    return localStorage.getItem(this.httpConfig.storageTokenKeyName)
  }

  isUnauthenticated = (data: any) => {
    if (data?.code === 401) {
      Emitter.emit(Events.Unauthenticated, true)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('dpr-userdata')
      localStorage.removeItem('dpr-token')
      localStorage.removeItem('dpr-token-refresh')
      const baseUrl = import.meta.env.BASE_URL

      window.location.href = baseUrl + '/login'
    } else if (data?.code === 422) {
      if (!localStorage.getItem('dpr-userdata')) {
        Emitter.emit(Events.Unauthenticated, true)
      }
    } else if (data?.code === 400) {
      if (!localStorage.getItem('dpr-userdata')) {
        Emitter.emit(Events.Unauthenticated, true)
      }
    } else {
      Emitter.emit(Events.Unauthenticated, false)
    }
  }

  getFormData = (data: any) => {
    const formData = new FormData()
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key])
        }
      }
    }
    return formData
  }
  request({
    async = false,
    noEntryMode = true,
    showErrorToast = false,
    showSuccessToast = false,
    method = 'post',
    path,
    jsonData = null,
    formData = null,
    params,
    authenticate = true,
    success = () => {},
    error = () => {},
    loading = () => {},
    baseURL = this.httpConfig.baseUrl,
    ...extra
  }: RequestType): AxiosPromise<any> | void {
    let data: any = null
    if (formData) {
      if (!noEntryMode) {
        formData = {
          ...formData,
          entry_mode: isValid(formData?.entry_mode) ? formData?.entry_mode : entryPoint
        }
      }
      data = this.getFormData(formData)
    } else if (jsonData) {
      if (!noEntryMode) {
        jsonData = {
          ...jsonData,
          entry_mode: isValid(jsonData?.entry_mode) ? jsonData?.entry_mode : entryPoint
        }
      }
      data = jsonData
    }
    loading(true)
    const settings = {
      method,
      baseURL,
      url: path,
      params: { ...params }, // entry_mode: `web-${WebAppVersion.current}`
      data,
      transformRequest: [
        function (dataLocal: any, headers: any) {
          // log("headers", headers)
          // delete auth header
          if (!authenticate) delete headers.Authorization
          // change content type
          if (jsonData) {
            dataLocal = JSON.stringify(dataLocal)
            headers['Content-Type'] = 'application/json'
            headers['Accept'] = '*/*'
          }
          // add cors headers
          headers['Access-Control-Allow-Origin'] = '*'
          headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

          return dataLocal
        }
      ],
      transformResponse: [
        (dataLocal: any) => {
          //   log('transformResponse', dataLocal)
          dataLocal = JSON.parse(dataLocal)
          // Do whatever you want to transform the data
          // log('transformResponse', dataLocal)
          this.isUnauthenticated(dataLocal)
          return dataLocal
        }
      ],
      ...extra
    }
    if (async) {
      return axios(settings)
    } else {
      // log("settings", settings)
      const http = axios(settings)
      http
        .then((res) => {
          this.returnSuccessResponse(res, showSuccessToast, showErrorToast, success, error, loading)
        })
        .catch((e) => {
          // if (String(e?.request?.responseURL)?.includes('/unauthorized')) {
          //   this.isUnauthenticated({ code: 401 })
          //   window.location.href = '/login'
          // }
          this.returnErrorResponse(e, showErrorToast, error, loading)
        })
    }
  }

  // rex(showSuccessToast, showErrorToast, success = () => { }, error = () => { }, loading = () => { }) {
  //     axios.interceptors.response.use(
  //         response => {
  //             return response
  //         },
  //         err => {
  //             // ** const { config, response: { status } } = error
  //             const { config, response } = err
  //             const originalRequest = config
  //             log("axios.interceptors.response", { response, config })
  //             // ** if (status === 401) {
  //             if (response && response.status === 401) {
  //                 if (!this.isAlreadyFetchingAccessToken) {
  //                     this.isAlreadyFetchingAccessToken = true
  //                     Emitter.on("AuthSuccess", (x) => {
  //                         log("xx", x)
  //                         const http = axios(originalRequest)
  //                         http.then((res) => {
  //                             this.isAlreadyFetchingAccessToken = false
  //                             this.returnSuccessResponse(res, showSuccessToast, showErrorToast, success, error, loading)
  //                         }).catch((e) => {
  //                             this.returnErrorResponse(e, showErrorToast, error, loading)
  //                         })
  //                     })
  //                 }
  //             }
  //             return Promise.reject(err)
  //         }
  //     )
  // }
  // retryOriginalRequest(originalRequest) {
  //     this.isAlreadyFetchingAccessToken = false
  //     const retryOriginalRequest = new Promise(resolve => {
  //         resolve(axios(originalRequest))
  //     })
  //     return retryOriginalRequest
  // }

  returnSuccessResponse = (
    res: any,
    showSuccessToast: boolean,
    showErrorToast: boolean,
    success = (e: any) => {},
    error = (e: any) => {},
    loading = (e: any) => {}
  ) => {
    loading(false)
    const data = res.data
    if (data.error === false) {
      //   log(decryptAnything(data?.payload))
      success(data)
      if (showSuccessToast && data?.message) {
        SuccessToast(data?.message)
      }
    } else {
      error({
        error: true,
        data: res?.data
      })
      if (showErrorToast && res.data?.message) {
        ErrorToast(res.data?.message)
      }
    }
  }
  returnErrorResponse = (
    e: any,
    showErrorToast: boolean,
    error = (a: any) => {},
    loading = (a: any) => {}
  ) => {
    loading(false)
    log('response error cache', e)
    error({
      error: true,
      data: e?.response?.data,
      ...e
    })
    if (showErrorToast && e?.response?.data?.message) {
      ErrorToast(e?.response?.data?.message)
    } else {
      if (e?.code === 'ERR_NETWORK') {
        ErrorToast(
          'Something went wrong, please check the file you are uploading (suspicious file).'
        )
      }
    }
  }
}
// (): BaseQueryFn<
// {
//   path: string
//   method: AxiosRequestConfig['method']
//   params?: AxiosRequestConfig['params']
//   jsonData?: any
//   formData?: any
//   authenticate?: boolean
//   noEntryMode?: boolean
//   showErrorToast?: boolean
//   showSuccessToast?: boolean
// },
// unknown,
// unknown
// > =>
const http = new HttpService({})
export const axiosBaseQuery =
  (baseURL?: string): BaseQueryFn<RequestType> =>
  async ({
    showErrorToast = true,
    showSuccessToast = false,
    noEntryMode,
    authenticate = true,
    path,
    method,
    jsonData,
    formData,
    params
  }: RequestType) => {
    try {
      const a = await http.request({
        showSuccessToast,
        showErrorToast,
        noEntryMode,
        authenticate,
        async: true,
        path,
        method,
        jsonData,
        formData,
        params,
        baseURL
      })
      //   const data: any = defaultHttpConfig.enableAES ? decryptAnything(a?.data) : a?.data
      const data: any = a?.data
      if (showSuccessToast) {
        SuccessToast(a?.data?.message)
      }
      return { data: data ?? '' }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      const data = err.response?.data as any
      const errMessage = data?.message as any
      if (showErrorToast) {
        ErrorToast(errMessage)
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message
        }
      }
    }
  }

//   http
//   .then((res) => {
//     this.returnSuccessResponse(res, showSuccessToast, showErrorToast, success, error, loading)
//   })
//   .catch((e) => {
//     if (e?.request?.responseURL === `${httpConfig.baseUrl}`) {
//       this.isUnauthenticated({ code: 401 })
//     }
//     this.returnErrorResponse(e, showErrorToast, error, loading)
//   })
// log(`${httpConfig.baseUrl}unauthorized`)
// }
