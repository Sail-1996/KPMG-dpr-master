import { getPath } from '@src/router/RouteHelper'
import { log } from '../Utils'

export const NotificationLocator = (notification, navigate) => {
  const item = notification?.type
  const data = notification
    ? {
        id: notification?.id,
        user_id: notification?.user_id,
        sender_id: notification?.sender_id,
        title: notification?.title,
        message: notification?.message,
        data_id: notification?.data_id,
        type: notification?.type,
        event: notification?.event,
        status_code: notification?.status_code,
        read_status: notification?.read_status,
        read_at: notification?.read_at,
        created_at: notification?.created_at,
        updated_at: notification?.updated_at
      }
    : ''
  log(item)
  switch (item) {
    case 'Vendor':
      if (notification?.type === 'Vendor') {
        navigate(getPath('dpr.vendor'), { state: data })
      }
      break
    case 'Project':
      if (notification?.type === 'Project') {
        navigate(getPath('dpr.project'), { state: data })
      }
      break
    case 'WorkPackage':
      if (notification?.type === 'WorkPackage') {
        navigate(getPath('dpr.workpackage'), { state: data })
      }
      break
    case 'User':
      if (notification?.type === 'User') {
        navigate(getPath('dpr.user'), { state: data })
      }
      break
    case 'Dpr-Config':
      if (notification?.type === 'Dpr-Config') {
        navigate(getPath('dpr.config'), { state: data })
      }
      break
    case 'DprImport':
      if (notification?.type === 'DprImport') {
        navigate(getPath('dpr.report'), { state: data })
      }
      break
    default:
      break
  }
}
