// ** Icons Import
import { getPath } from '@src/router/RouteHelper'
import { Permissions } from '@src/utility/Permissions'
import {
  Home,
  Circle,
  Users,
  UserPlus,
  Activity,
  Database,
  Layers,
  Server,
  Sliders,
  Airplay,
  Cpu,
  BarChart2,
  Printer,
  HardDrive,
  Monitor,
  File,
  List
} from 'react-feather'

export default [
  {
    id: 'home',
    title: 'dashboard',
    icon: <Home size={20} />,
    navLink: getPath('dashboard'),
    ...Permissions.dashboardBrowse
  },
  {
    id: 'config',
    title: 'dpr-interface',
    icon: <Activity size={20} />,
    navLink: getPath('dpr.interface'),
    ...Permissions.interfaceBrowse
  },
  {
    id: 'dpr-users-page',
    title: 'administration',
    icon: <Airplay size={20} />,
    badge: 'light-success',
    children: [
      {
        id: 'management',
        title: 'dpr-management',
        icon: <HardDrive size={20} />,
        navLink: getPath('dpr.config'),
        ...Permissions.configBrowseAdmin
      },
      {
        id: 'project',
        title: 'project',
        icon: <Server size={20} />,
        navLink: getPath('dpr.project'),
        ...Permissions.projectBrowse
      },
      {
        id: 'dpr-role',
        title: 'role',
        icon: <BarChart2 size={12} />,
        navLink: getPath('dpr.role'),
        ...Permissions.roleBrowse
      },
      {
        id: 'dpr-user',
        title: 'user',
        icon: <UserPlus size={12} />,
        navLink: getPath('dpr.user'),
        ...Permissions.userBrowse
      },
      {
        id: 'vendor',
        title: 'vendor',
        icon: <Sliders size={20} />,
        navLink: getPath('dpr.vendor'),
        ...Permissions.vendorBrowse
      },
      {
        id: 'work-package',
        title: 'work-package',
        icon: <Database size={20} />,
        navLink: getPath('dpr.workpackage'),
        ...Permissions.workpackBrowse
      },
      {
        id: 'item',
        title: 'item-description',
        icon: <List size={20} />,
        navLink: getPath('dpr.item'),
        ...Permissions.itemDescriptionBrowse
      }
    ]
  },
  {
    id: 'dpr-dpr-report',
    title: 'reports',
    icon: <Printer size={20} />,
    badge: 'light-success',
    children: [
      {
        id: 'dpr-report',
        title: 'DPR Report',
        icon: <Circle size={12} />,
        navLink: getPath('dpr.report'),
        ...Permissions.reportBrowse
      },
      {
        id: 'summary-report',
        title: 'Summary Report',
        icon: <Circle size={12} />,
        navLink: getPath('summary.report'),
        ...Permissions.reportBrowse
      }
    ]
  },
  {
    id: 'logsListMain',
    title: 'system-logs',
    icon: <Monitor size={12} />,
    children: [
      {
        id: 'logsList',
        title: 'event-logs',
        icon: <Monitor size={12} />,
        navLink: getPath('log.list'),
        ...Permissions.logsBrowse
      },
      {
        id: 'logsListAudit',
        title: 'audit-logs',
        icon: <File size={12} />,
        navLink: getPath('log.audit.list'),
        ...Permissions.logsBrowse
      }
    ]
  }
]
