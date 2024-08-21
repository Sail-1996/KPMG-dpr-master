import { FM } from './Utils'

/* eslint-disable no-undef */
export const WebAppVersion = Object.freeze({
  current: '0.0.1'
})

export const entryPoint = `web-${WebAppVersion.current}`

export const Events = Object.freeze({
  Unauthenticated: 'Unauthenticated',
  reactSelect: 'reactSelect',
  RedirectMessage: 'goToMessage',
  RedirectNotification: 'goToNotification',
  created: 'created',
  updated: 'updated',
  deleted: 'deleted',
  approved: 'approved',
  assigned: 'assigned',
  stampIn: 'stampIn',
  stampOut: 'stampOut',
  leaveRequest: 'leaveRequest',
  leaveApproved: 'leaveApproved',
  bankIdVerification: 'bankIdVerification',
  emergency: 'emergency',
  completed: 'completed',
  request: 'request',
  confirmAlert: 'confirmAlert'
})

export const IconSizes = Object.freeze({
  InputAddon: 16,
  HelpIcon: 12,
  MenuVertical: 22,
  CardListIcon: 15
})

export const CouponType = Object.freeze({
  fixed: 1,
  percentage: 2
})

export const Patterns = Object.freeze({
  AlphaOnly: /^[a-zA-Z ]*$/,
  AlphaOnlyNoSpace: /^[a-zA-Z]*$/,
  AlphaNumericOnlyNoSpace: /^[a-zA-Z0-9]*$/,
  AlphaNumericOnly: /^[a-zA-Z0-9 ]*$/,
  NumberOnly: /^\d+(\.\d{1,2})?$/,
  NumberOnlyNoDot: /^[0-9]*$/,
  EmailOnly: /^\w+([!#$%&'*+-/=?^_`{|]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/,
  Password: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
  AlphaNumericWithAtperSpaceHash: /^[a-zA-Z0-9@# ]*$/,
  AlphaNumericForUser: /^[a-zA-Z0-9-_ ]+$/,
})

export const PrimaryAction = Object.freeze({
  status: 1
})
export const Applicable = Object.freeze({
  'Refund Applicable': 'refund_applicable',
  'Retry Applicable': 'retry_applicable'
})

export const AuthorityType = Object.freeze({
  'On Delivered': 1,
  'On Submission': 2
})
export const UserType = Object.freeze({
  Admin: 1,
  Store: 2,
  Employee: 3,
  AdminEmployee: 4
})
export const priority = Object.freeze({
  Normal: '0',
  Medium: '1',
  Fast: '2',
  Instant: '3'
})

export const statusCode = Object.freeze({
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  error: 'error'
})

export const sendType = Object.freeze({
  push: 1,
  email: 2
})

export const activeStatus = Object.freeze({
  Active: 1
})
// export const orderStatus = Object.freeze({
//   Completed: 1,
//   Cancelled: 2,
//   Pending: 3
// })

export const status = Object.freeze({
  Active: '1',
  InActive: '0'
})
// export const activeStatuss = Object.freeze({
//     Active: "1",
//     InActive: "0"
// })

// transaction, 2:promotional, 3:two_waysms, 4:voice_sms

// credit_type: 1:credit, 2:debit
export const actionFor = Object.freeze({
  Transaction: '1',
  Promotional: '2',
  ' Two Way Sms': '3',
  Voice: '4'
})

export const creditType = Object.freeze({
  Credit: '1',
  Debit: '2'
})
export const smsType = Object.freeze({
  'Normal SMS': '1',
  'Customer SMS': '2'
})

export const routeType = Object.freeze({
  Transaction: '1',
  Promotional: '2',
  ' Two Way Sms': '3',
  Voice: '4'
})

export const smsPriority = Object.freeze({
  High: '1',
  Normal: '2'
})

export const isUnique = Object.freeze({
  Yes: '1',
  No: '0'
})

export const subscriptionType = Object.freeze({
  Transaction: '1',
  Month: '2',
  Year: '3'
})
export const units = Object.freeze({
  piece: 'piece',
  kilogram: 'kilogram',
  liter: 'liter',
  dozen: 'dozen'
})
export const restrictions = Object.freeze({
  minimum_age: 'minimum_age_required',
  id_required: 'id_required',
  prescription_required: 'prescription_required',
  max_quantity: 'max_quantity',
  min_quantity: 'min_quantity'
})

export type ActionTypes = {
  action: 'delete' | 'active' | 'inactive'
  ids: Array<number>
}

export const amountReceived = Object.freeze({
  yes: 1,
  no: 2
})

export const subscriptionStoreType = Object.freeze({
  perTransaction: '1',
  perMonth: '2',
  both: '3'
})

export type CouponCode = {
  // general details
  store_id?: number
  coupon_code?: string
  discount_value?: number //
  max_discount?: number
  date_expires?: string | Date
  discount_type?: 'percentage' | 'fixed'
  description?: string
  // Usage Restriction
  min_applicable_amount?: number
  product_ids?: Array<number>
  product_category_ids?: Array<number>
  // Usage Limits
  usage_limit?: number
  usage_limit_per_user?: number
  limit_usage_to_x_items?: number
}

export const ProductOfferTypes = Object.freeze({
  amount: 1,
  percent: 2,
  same_quantity_on_quantity: 3,
  same_quantity_on_percent: 4,
  diff_quantity_on_quantity: 5
})
export const ProductOfferTypesDrops = Object.freeze({
  amount: 1,
  percent: 2,
  same_quantity_on_quantity: 3
  // same_quantity_on_percent: 4,
  // diff_quantity_on_quantity: 5
})
export const CategoryOfferTypes = Object.freeze({
  amount: 1,
  percent: 2
})
export const ProductOffers = Object.freeze({
  amount: 1,
  percent: 2
})
export enum CMD {
  Register = 'store-register',
  Disconnect = 'disconnect',
  GetAllSessions = 'getallsessions',
  GetCustomerSession = 'getcustomersession',
  RemoveCustomerSession = 'removecustomersession',
  AddCartItem = 'addtocart',
  UpdateCartItem = 'updatecart',
  RemoveCartItem = 'removecartitem',
  ProductInfo = 'productinfo'
}

export const mapApiKey = 'AIzaSyCa3cmHM3EN6lfzeGhF0utqnpiXDl4rHww|dsfsfsdfdsfdsfdsfdsfds'

export type userProps = {
  id?: any
  unique_id?: any
  store_qr_code?: any
  user_type_id?: any
  permissions?: any
  store_id?: any
  store_setting?: any
  parent_id?: any
  name?: any
  email?: any
  email_verified_at?: any
  mobile_number?: any
  locale?: any
  address?: any
  city?: any
  country?: any
  currency?: any
  postal_area?: any
  zip_code?: any
  personal_number?: any
  organization_number?: any
  stripe_customer_id?: any
  created_by?: any
  status?: any
  entry_mode?: any
  created_at?: any
  updated_at?: any
  deleted_at?: any
  access_token?: any
  languages?: any
  avatar?: any
}
