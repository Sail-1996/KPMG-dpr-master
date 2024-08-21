// ** Dropdowns Imports
import IntlDropdown from './IntlDropdown'
import CartDropdown from './CartDropdown'
import UserDropdown from './UserDropdown'
import NavbarSearch from './NavbarSearch'
import NotificationDropdown from './NotificationDropdown'

// ** Third Party Components
import { Sun, Moon, Shield } from 'react-feather'

// ** Reactstrap Imports
import { DropdownItem, NavItem, NavLink } from 'reactstrap'
import { FM } from '@src/utility/Utils'
import { getPath } from '@src/router/RouteHelper'
import { Link } from 'react-router-dom'
// import Profile from '@src/modules/dpr/views/Profile'

const NavbarUser = (props) => {
  // ** Props
  const { skin, setSkin } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      {/* <IntlDropdown /> */}
      {/* <NavItem className='d-none d-lg-block'> */}
      {/* <NavLink className='nav-link-style'>
          <ThemeToggler />
        </NavLink> */}
      {/* </NavItem> */}
      {/* <NavbarSearch />
      <CartDropdown /> */}
      <NotificationDropdown />
      {/* <DropdownItem tag={Link} to={getPath('dpr.profile')}>
          <Shield size={14} className='me-75' />
          <span className='align-middle'>{FM('profile')}</span>
        </DropdownItem> */}
      {/* <NavItem className='d-block d-lg-block'>
          <Link to='/profile'>Profile</Link>
      </NavItem> */}
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
