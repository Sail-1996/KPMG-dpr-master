import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import http from '@src/utility/http/useHttp'

export const uploadFiles = async ({
  controller = new AbortController(),
  progress = (e: any) => {},
  async = false,
  formData,
  loading = () => {},
  success = () => {},
  error = () => {}
}: {
  controller?: any
  progress?: (e: any) => void
  formData?: any
  loading?: (e: boolean) => void
  async?: boolean
  success?: (e: any) => void
  error?: (e: any) => void
}) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.fileUpload,
    formData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {
      error(true)
    },
    onUploadProgress: (progressEvent: any) => {
      progress((progressEvent.loaded / progressEvent.total) * 100)
    },
    signal: controller.signal
  })
}
