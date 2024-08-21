// ** React Imports
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

// ** Icons Imports
import { Disc, X, Circle } from 'react-feather'

// ** Config
import themeConfig from '@configs/themeConfig'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'

// logo
import { ReactComponent as AppLogo } from '@@assets/images/logo/logo.svg'
import { useSkin } from '@hooks/useSkin'
import useUser from '@hooks/useUser'

const VerticalMenuHeader = (props) => {
  // ** Props
  const { menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover } = props

  // use skin
  const { skin } = useSkin()

  // ** Vars
  const user = getUserData()
  const userAppData = useUser()

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour='toggle-icon'
          className={`${
            skin === 'dark' ? 'text-light' : 'text-primary'
          } toggle-icon d-none d-xl-block`}
          onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour='toggle-icon'
          className={`${
            skin === 'dark' ? 'text-light' : 'text-primary'
          }  toggle-icon d-none d-xl-block`}
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className='navbar-header'>
      <ul className='nav navbar-nav flex-row'>
        <li className='nav-item me-auto'>
          <NavLink to={'/dashboard'} className='navbar-brand'>
            <span className={`brand-logo ${skin === 'dark' ? 'text-light' : 'text-primary'}`}>
              {/* <AppLogo /> */}
              <img
                src={userAppData?.app_logo}
                style={{
                  height: 15,
                  width: 'auto'
                }}
              />
            </span>
            <h2 className={`brand-text mb-0 ${skin === 'dark' ? 'text-light' : 'text-primary'} `}>
              {/* <AppLogo /> */}
              <img
                src={userAppData?.app_logo}
                style={{
                  height: 30,
                  width: 'auto'
                }}
                className='text-primary'
              />
            </h2>
          </NavLink>
        </li>
        <li className='nav-item nav-toggle'>
          <div className='nav-link modern-nav-toggle cursor-pointer'>
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className='toggle-icon icon-x d-block d-xl-none'
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
