/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { axiosBaseQuery } from '@src/utility/http/Http'
import httpConfig from '@src/utility/http/httpConfig'
import { HttpResponse, PagePerPageRequest } from '@src/utility/types/typeResponse'

interface RequestType extends PagePerPageRequest {
  jsonData?: any
}
interface ResponseType extends HttpResponse<any> {
  someExtra: any
}
export const MeetingExampleRTK = createApi({
  reducerPath: 'MeetingLoadCategory',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loadCategory: builder.mutation<ResponseType, RequestType>({
      query: (a) => ({
        jsonData: a?.jsonData,
        params: { page: a?.page, per_page_record: a?.per_page_record },
        method: 'get',
        path: ApiEndpoints.load_category
      })
    })
  })
})
export const { useLoadCategoryMutation } = MeetingExampleRTK
