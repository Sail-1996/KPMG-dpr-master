// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/not-authorized.svg'
import illustrationsDark from '@src/assets/images/pages/not-authorized-dark.svg'
import { ReactComponent as AppLogo } from '@@assets/images/logo/logo.svg'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import { useGetSettingMutation } from '@src/modules/dpr/redux/RTKQuery/ProfileRTK'
import { useEffect } from 'react'

const NotAuthorized = () => {
  // ** Hooks
  const { skin } = useSkin()

  // ** Vars
  const user = getUserData()

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  // Load App Settings
  const [loadSetting, { data, isSuccess, isLoading, isError }] = useGetSettingMutation()

  useEffect(() => {
    loadSetting()
  }, [])

  const appData = data?.data

  return (
    <div className='misc-wrapper'>
      <Link className='brand-logo' to='/'>
        {/* <AppLogo /> */}
        <span className={`brand-logo ${skin === 'dark' ? 'text-light' : 'text-primary'}`}>
          <img
            src={appData?.app_logo}
            style={{
              height: 20,
              width: 'auto'
            }}
          />
        </span>
      </Link>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>You are not authorized! 🔐</h2>
          <p className='mb-2'>Please contact the admin for the authorization.</p>
          <Button
            tag={Link}
            color='primary'
            className='btn-sm-block mb-1'
            to={user ? getHomeRouteForLoggedInUser(user.role) : '/'}
          >
            Back to Home
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default NotAuthorized
