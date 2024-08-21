// ** React Imports
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { handleLogout } from '@store/authentication'
import { useDispatch } from 'react-redux'

// ** Third Party Components
import { Power, Settings, User } from 'react-feather'

// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

// ** Default Avatar Image
import useUser from '@hooks/useUser'
import defaultAvatar from '@src/assets/images/avatars/lady-avatar.png'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import httpConfig from '@src/utility/http/httpConfig'
import { Permissions } from '@src/utility/Permissions'
import Show from '@src/utility/Show'
import { FM } from '@src/utility/Utils'
import axios from 'axios'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const user = useUser()

  // ** State
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(user)
    }
  }, [user])

  const loadLogout = (e) => {
    e.preventDefault()
    axios
      .post(`${httpConfig.baseUrl}${ApiEndpoints.logout}`)
      .then((res) => {
        setLoading(false)

        dispatch(handleLogout())
        const baseUrl = import.meta.env.BASE_URL

        window.location.href = baseUrl + '/login'
      })
      .catch((err) => {
        setError(err?.response?.data?.message)
      })
  }

  const getName = () => {
    // if (userData && userData?.role_id === 1) {
    //   return user?.name
    // } else if (userData && userData?.vendor_id !== null) {
    //   return 'Vendor User'
    // } else {
    //   return 'Normal User'
    // }
    return userData?.roles.name
  }

  //** Vars
  const userAvatar = defaultAvatar

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle
        href='/'
        tag='a'
        className='nav-link dropdown-user-link'
        onClick={(e) => e.preventDefault()}
      >
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{(userData && userData['name']) || 'John Doe'}</span>
          <span className='user-status'>{getName() ?? 'User'}</span>
        </div>
        {/* <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' /> */}
      </DropdownToggle>
      <DropdownMenu end>
        <Show IF={Permissions.profileBrowse}>
          <DropdownItem tag={Link} to='/profile'>
            <User size={14} className='me-75' />
            <span className='align-middle'>{FM('profile')}</span>
          </DropdownItem>
        </Show>
        <Show IF={Permissions.settingBrowse}>
          <DropdownItem tag={Link} to='/app-setting'>
            <Settings size={14} className='me-75' />
            <span className='align-middle'>{FM('app-setting')}</span>
          </DropdownItem>
        </Show>
        <DropdownItem tag={Link} to='/login' onClick={loadLogout}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>{FM('logout')}</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
