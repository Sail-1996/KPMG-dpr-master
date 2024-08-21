import { log } from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import http from '@src/utility/http/useHttp'
import { SuccessToast } from '@src/utility/Utils'

interface dataTypes {
  async?: boolean
  jsonData?: any
  id?: string | number | null
  page?: string | number
  perPage?: string | number
  successMessage?: any
  dispatch?: (e: any) => void
  success?: (e: any) => void
  error?: (e: any) => void
  loading?: (e: boolean) => void
}
export const downloadPDF = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  successMessage = 'PDF Downloaded Successfully',
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.download_pdf,
    jsonData,
    loading,
    // params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
      log(e, 'sasd')
      SuccessToast(successMessage)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const downloadExcel = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  successMessage = 'Excel Downloaded Successfully',
  dispatch = () => {},
  success = () => {}
}: dataTypes) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.download_excel,
    jsonData,
    loading,
    // params: { page, per_page_record: perPage },
    success: (e: any) => {
      success(e)
      log(e, 'sasd')
      SuccessToast(successMessage)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
