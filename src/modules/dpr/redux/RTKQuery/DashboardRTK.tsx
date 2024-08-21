/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { HttpListResponse, HttpResponse, PagePerPageRequest } from '@src/utility/types/typeResponse'
import { isValid } from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { axiosBaseQuery } from '@src/utility/http/Http'
import { DPR } from '@src/utility/types/typeDPR'

interface RequestType extends PagePerPageRequest {
  jsonData?: any
  sheet_name?: any
}
interface ResponseType extends HttpResponse<DPR> {
  someExtra: any
}

interface ResponseTypeList extends HttpListResponse<DPR> {
  someExtra: any
}

export const DashboardManagement = createApi({
  reducerPath: 'DashboardManagement',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadDashboard: builder.mutation<ResponseType, RequestType>({
      query: (jsonData) => ({
        method: 'post',
        jsonData,
        path: ApiEndpoints.dashboard
      })
    })
  })
})
export const { useLoadDashboardMutation } = DashboardManagement
