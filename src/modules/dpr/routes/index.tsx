import { Permissions } from '@src/utility/Permissions'
import { lazy } from 'react'

const DPRReport = lazy(() => import('@modules/dpr/views/Reports/DprReport'))
const SummaryReport = lazy(() => import('@modules/dpr/views/Reports/summaryReport'))
const DPRForm = lazy(() => import('@modules/dpr/views/DPR/DprForm'))
const Dashboard = lazy(() => import('@modules/dpr/views/Dashboard'))
const WorkPackage = lazy(() => import('@modules/dpr/views/WorkPackage'))
const WorkPackageAddUpdate = lazy(() => import('@modules/dpr/views/WorkPackage/WorkPackageForm'))
const Organization = lazy(() => import('@src/modules/dpr/views/Organization'))
const OrganizationAddUpdate = lazy(
  () => import('@src/modules/dpr/views/Organization/OrganizationForm')
)
const Project = lazy(() => import('@modules/dpr/views/Project'))
const ProjectAddUpdate = lazy(() => import('@modules/dpr/views/Project/ProjectForm'))
const Vendor = lazy(() => import('@modules/dpr/views/Vendor'))
const VendorAddUpdate = lazy(() => import('@modules/dpr/views/Vendor/VendorForm'))
const User = lazy(() => import('@modules/dpr/views/UserManagement'))
const UserAddUpdate = lazy(() => import('@modules/dpr/views/UserManagement/UserForm'))
const Role = lazy(() => import('@modules/dpr/views/Role'))
const RoleAddUpdate = lazy(() => import('@modules/dpr/views/Role/RoleForm'))
const Config = lazy(() => import('@src/modules/dpr/views/Config'))
const ConfigAddUpdate = lazy(() => import('@src/modules/dpr/views/Config/ConfigForm'))
const Profile = lazy(() => import('@src/modules/dpr/views/Profile'))
const ProfileUpdate = lazy(() => import('@src/modules/dpr/views/Profile/UpdateForm'))
const AppSetting = lazy(() => import('@src/modules/dpr/views/AppSetting'))
const DprTable = lazy(() => import('@src/modules/dpr/views/DprTable'))
const PermissionCreate = lazy(() => import('@src/modules/dpr/views/Role/CreatePermissions'))
const LogList = lazy(() => import('@modules/dpr/views/Logs'))
const AuditLogList = lazy(() => import('@modules/dpr/views/Logs/AuditLogs'))
const ItemDescription = lazy(() => import('@modules/dpr/views/ItemDescription'))
const ItemDescriptionAddUpdate = lazy(
  () => import('@modules/dpr/views/ItemDescription/ItemDescriptionForm')
)

const DprRoutes = [
  {
    element: <Dashboard />,
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      ...Permissions.dashboardBrowse
    }
  },
  {
    path: '/dpr-update/:id/:name',
    element: <DPRForm />,
    name: 'dpr.update',
    meta: {
      ...Permissions.interfaceBrowse
    }
  },
  {
    path: '/dpr-report',
    element: <DPRReport />,
    name: 'dpr.report',
    meta: {
      ...Permissions.reportBrowse
    }
  },
  {
    path: '/summary-report',
    element: <SummaryReport />,
    name: 'summary.report',
    meta: {
      ...Permissions.reportBrowse
    }
  },
  {
    path: '/work-package',
    element: <WorkPackage />,
    name: 'dpr.workpackage',
    meta: {
      ...Permissions.workpackBrowse
    }
  },
  {
    path: '/work-package-create',
    element: <WorkPackageAddUpdate />,
    name: 'dpr.workpackage.create',
    meta: {
      ...Permissions.workpackCreate
    }
  },
  {
    path: '/work-package-update/:id',
    element: <WorkPackageAddUpdate />,
    name: 'dpr.workpackage.update',
    meta: {
      ...Permissions.workpackEdit
    }
  },
  {
    path: '/organization',
    element: <Organization />,
    name: 'dpr.organization',
    meta: {
      ...Permissions.organizationsBrowse
    }
  },
  {
    path: '/organization-create',
    element: <OrganizationAddUpdate />,
    name: 'dpr.organization.create',
    meta: {
      ...Permissions.organizationsCreate
    }
  },
  {
    path: '/organization-update/:id',
    element: <OrganizationAddUpdate />,
    name: 'dpr.organization.update',
    meta: {
      ...Permissions.organizationsEdit
    }
  },
  {
    path: '/project',
    element: <Project />,
    name: 'dpr.project',
    meta: {
      ...Permissions.projectBrowse
    }
  },
  {
    path: '/project-create',
    element: <ProjectAddUpdate />,
    name: 'dpr.project.create',
    meta: {
      ...Permissions.projectCreate
    }
  },
  {
    path: '/project-update/:id',
    element: <ProjectAddUpdate />,
    name: 'dpr.project.update',
    meta: {
      ...Permissions.projectEdit
    }
  },
  {
    path: '/vendor',
    element: <Vendor />,
    name: 'dpr.vendor',
    meta: {
      ...Permissions.vendorBrowse
    }
  },
  {
    path: '/vendor-create',
    element: <VendorAddUpdate />,
    name: 'dpr.vendor.create',
    meta: {
      ...Permissions.vendorCreate
    }
  },
  {
    path: '/vendor-update/:id',
    element: <VendorAddUpdate />,
    name: 'dpr.vendor.update',
    meta: {
      ...Permissions.vendorEdit
    }
  },
  {
    path: '/user',
    element: <User />,
    name: 'dpr.user',
    meta: {
      ...Permissions.userBrowse
    }
  },
  {
    path: '/user-create',
    element: <UserAddUpdate />,
    name: 'dpr.user.create',
    meta: {
      ...Permissions.userCreate
    }
  },
  {
    path: '/user-update/:id',
    element: <UserAddUpdate />,
    name: 'dpr.user.update',
    meta: {
      ...Permissions.userEdit
    }
  },
  {
    path: '/role',
    element: <Role />,
    name: 'dpr.role',
    meta: {
      ...Permissions.roleBrowse
    }
  },
  {
    path: '/role-create',
    element: <RoleAddUpdate />,
    name: 'dpr.role.create',
    meta: {
      ...Permissions.roleCreate
    }
  },
  {
    path: '/role-update/:id',
    element: <RoleAddUpdate />,
    name: 'dpr.role.update',
    meta: {
      ...Permissions.roleEdit
    }
  },
  {
    path: '/management',
    element: <Config />,
    name: 'dpr.config',
    meta: {
      ...Permissions.configBrowseAdmin
    }
  },
  {
    path: '/management-create',
    element: <ConfigAddUpdate />,
    name: 'dpr.config.create',
    meta: {
      ...Permissions.dprConfig
    }
  },
  {
    path: '/management-update/:id',
    element: <ConfigAddUpdate />,
    name: 'dpr.config.update',
    meta: {
      ...Permissions.dprConfig
    }
  },
  {
    path: '/profile',
    element: <Profile />,
    name: 'dpr.profile',
    meta: {
      ...Permissions.profileBrowse
    }
  },
  {
    path: '/profile/:id',
    element: <ProfileUpdate />,
    name: 'dpr.profile.update',
    meta: {
      ...Permissions.profileBrowse
    }
  },
  {
    path: '/app-setting',
    element: <AppSetting />,
    name: 'dpr.appSetting',
    meta: {
      ...Permissions.settingBrowse
    }
  },
  {
    path: '/interface',
    element: <DprTable />,
    name: 'dpr.interface',
    meta: {
      ...Permissions.interfaceBrowse
    }
  },
  {
    path: '/permissions',
    element: <PermissionCreate />,
    name: 'dpr.permissions',
    meta: {
      ...Permissions.roleBrowse
    }
  },
  {
    element: <LogList />,
    path: '/logs',
    name: 'log.list',
    meta: {
      ...Permissions.logsBrowse
    }
  },
  {
    element: <AuditLogList />,
    path: '/audit-logs',
    name: 'log.audit.list',
    meta: {
      ...Permissions.logsBrowse
    }
  },
  {
    path: '/item-description',
    element: <ItemDescription />,
    name: 'dpr.item',
    meta: {
      ...Permissions.itemDescriptionBrowse
    }
  },
  {
    path: '/item-description-create',
    element: <ItemDescriptionAddUpdate />,
    name: 'dpr.item.create',
    meta: {
      ...Permissions.itemDescriptionCreate
    }
  },
  {
    path: '/item-description-update/:id',
    element: <ItemDescriptionAddUpdate />,
    name: 'dpr.item.update',
    meta: {
      ...Permissions.itemDescriptionEdit
    }
  }
] as const

export type DprRouteName = (typeof DprRoutes)[number]['name']
export default DprRoutes
