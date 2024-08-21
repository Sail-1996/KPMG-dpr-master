import { lazy } from 'react'

const Email = lazy(() => import('@modules/meeting/views/users/UserList'))
const UserManagement = lazy(() => import('@modules/meeting/views/users/UserList'))
const UserCreate = lazy(() => import('@modules/meeting/views/users/UserCreate'))

const MeetingRoutes = [
  {
    element: <Email />,
    path: '/home',
    name: 'home'
  },
  {
    element: <UserManagement />,
    path: '/user/list',
    name: 'user.list'
  },
  {
    element: <UserCreate />,
    path: '/user/create',
    name: 'user.create'
  }
] as const

export type MeetingRouteName = (typeof MeetingRoutes)[number]['name']
export default MeetingRoutes
