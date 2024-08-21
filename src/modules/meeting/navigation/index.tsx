// ** Icons Import
import { getPath } from '@src/router/RouteHelper'
import { Home, Circle, Users, UserPlus } from 'react-feather'

export default [
  {
    id: 'home',
    title: 'home',
    icon: <Home size={20} />,
    // badge: 'light-warning',
    // badgeText: '2',
    navLink: getPath('dashboard')
  },
  {
    id: 'users-page',
    title: 'users',
    icon: <Users size={20} />,
    badge: 'light-success',
    badgeText: '12',
    children: [
      {
        id: 'userList',
        title: 'all-users',
        icon: <Circle size={12} />,
        navLink: getPath('dashboard')
      },
      {
        id: 'userCreate',
        title: 'create-user',
        icon: <Circle size={12} />,
        navLink: getPath('dashboard')
      }
    ]
  }
]
