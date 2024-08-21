// ** Reducers Imports

import { DashboardManagement } from './RTKQuery/DashboardRTK'
import { ConfigManagement } from './RTKQuery/DprConfigRTK'
import { DirectManagement } from './RTKQuery/DprDirectRTK'
import { DPRImportManagement } from './RTKQuery/DprImportRTK'
import { DPRManagement } from './RTKQuery/DPRRTK'
import { GraphManagement } from './RTKQuery/GraphRTK'
import { NotificationManagement } from './RTKQuery/NotificationsRTK'
import { OrganizationManagement } from './RTKQuery/OrganizationRTK'
import { PermissionManagement } from './RTKQuery/PermissionRTK'
import { ProfileManagement } from './RTKQuery/ProfileRTK'
import { ProjectManagement } from './RTKQuery/ProjectRTK'
import { RoleManagement } from './RTKQuery/RoleRTK'
import { UserManagement } from './RTKQuery/UserRTK'
import { VendorManagement } from './RTKQuery/VendorRTK'
import { WorkPackageManagement } from './RTKQuery/WorkPackageRTK'
import { AppSettings } from './RTKQuery/AppSettingRTK'
import { ItemDescManagement } from './RTKQuery/ItemDescRTK'

const DprReducers = {
  // RTK
  [DPRManagement.reducerPath]: DPRManagement.reducer,
  [DPRImportManagement.reducerPath]: DPRImportManagement.reducer,
  [DashboardManagement.reducerPath]: DashboardManagement.reducer,
  [WorkPackageManagement.reducerPath]: WorkPackageManagement.reducer,
  [OrganizationManagement.reducerPath]: OrganizationManagement.reducer,
  [ProjectManagement.reducerPath]: ProjectManagement.reducer,
  [VendorManagement.reducerPath]: VendorManagement.reducer,
  [UserManagement.reducerPath]: UserManagement.reducer,
  [RoleManagement.reducerPath]: RoleManagement.reducer,
  [PermissionManagement.reducerPath]: PermissionManagement.reducer,
  [ConfigManagement.reducerPath]: ConfigManagement.reducer,
  [DirectManagement.reducerPath]: DirectManagement.reducer,
  [GraphManagement.reducerPath]: GraphManagement.reducer,
  [ProfileManagement.reducerPath]: ProfileManagement.reducer,
  [NotificationManagement.reducerPath]: NotificationManagement.reducer,
  [AppSettings.reducerPath]: AppSettings.reducer,
  [ItemDescManagement.reducerPath]: ItemDescManagement.reducer
}
const DprMiddleware = [
  DPRManagement.middleware,
  DPRImportManagement.middleware,
  DashboardManagement.middleware,
  WorkPackageManagement.middleware,
  OrganizationManagement.middleware,
  ProjectManagement.middleware,
  VendorManagement.middleware,
  UserManagement.middleware,
  RoleManagement.middleware,
  PermissionManagement.middleware,
  ConfigManagement.middleware,
  DirectManagement.middleware,
  GraphManagement.middleware,
  ProfileManagement.middleware,
  NotificationManagement.middleware,
  AppSettings.middleware,
  ItemDescManagement.middleware
]

export { DprReducers, DprMiddleware }
