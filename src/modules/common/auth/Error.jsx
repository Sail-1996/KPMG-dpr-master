// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/error.svg'
import illustrationsDark from '@src/assets/images/pages/error-dark.svg'
import { ReactComponent as AppLogo } from '@@assets/images/logo/logo.svg'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import { useGetSettingMutation } from '@src/modules/dpr/redux/RTKQuery/ProfileRTK'
import { useEffect } from 'react'

const Error = () => {
  // ** Hooks
  const { skin } = useSkin()

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
          <h2 className='mb-1'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-2'>
            Back to home
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error
