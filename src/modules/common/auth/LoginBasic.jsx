// ** React Imports
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

// ** Icons Imports

// ** Custom Components

// ** Reactstrap Imports
import {
  Alert,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  Label,
  Row
} from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// app logo
import { ReactComponent as AppLogo } from '@@assets/images/logo/logo.svg'
import LoadingButton from '@modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@modules/common/components/formGroupCustom/FormGroupCustom'
import themeConfig from '@src/configs/themeConfig'
import { handleLogin } from '@src/redux/authentication'
import { useAppDispatch } from '@src/redux/store'
import { Patterns } from '@src/utility/Const'
import { AbilityContext } from '@src/utility/context/Can'
import { loginApi, loginOtpApi } from '@src/utility/http/Apis/auth'
import {
  FM,
  base64Encode,
  getHomeRouteForLoggedInUser,
  isDebug,
  isValid,
  log
} from '@src/utility/Utils'
import { useCallback, useContext, useEffect, useState } from 'react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useForm } from 'react-hook-form'
import Emitter from '@src/utility/Emitter'
import bgImage from '@@assets/images/backgrounds/Picture1.png'
import Show from '@src/utility/Show'
import { useGetSettingMutation } from '@src/modules/dpr/redux/RTKQuery/ProfileRTK'
import backgroundImage from '@src/assets/images/backgrounds/Picture1.png'
import logoImage from '@src/assets/images/logo/logo2.svg'
const defaultValues = {
  // password: '12345678',
  // email: 'admin@gmail.com'
}

const extraPermissions = [
  //   {
  //     action: 'manage',
  //     subject: 'all'
  //   }
]

const LoginWithCaptcha = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [otpSentClicked, setOtpSentClicked] = useState(false)
  const [resendOtpTime, setResendOtpTime] = useState(60)
  const ability = useContext(AbilityContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect_to')
  const [sentOtp, setSentOtp] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [time, setTime] = useState(600)
  const [mes, setMes] = useState(false)
  const [lamda, setLamda] = useState(false)
  const {
    control,
    setError,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues })

  const showMessages = () => {
    return (
      <div className='alert alert-warning' role='alert'>
        {FM('redirecting')}
      </div>
    )
  }
  // Load App Settings
  const [loadSetting, { data, isSuccess, isLoading, isError }] = useGetSettingMutation()

  useEffect(() => {
    loadSetting()
  }, [])

  const appData = data?.data

  const otpAPi = (jsonData) => {
    if (isValid(jsonData)) {
      loginOtpApi({
        jsonData: {
          email: base64Encode(jsonData?.email),
          otp: base64Encode(jsonData?.otp)
          //   email: jsonData?.email,
          //   otp: jsonData?.otp
        },
        loading: setLoading,
        success: (res) => {
          setSentOtp(false)
          setLamda(true)
          const permissions =
            res?.data?.permissions?.map((a) => ({
              action: a.action,
              subject: a?.subject
            })) ?? []
          const data = {
            ...res?.data,
            accessToken: res?.data?.access_token,
            refreshToken: res?.data?.access_token,
            ability: permissions.concat(extraPermissions)
          }
          dispatch(handleLogin(data))
          ability.update(data?.ability)
          showMessages()
          const timer = setTimeout(() => {
            // navigate(getHome('admin'))
            log('redirectUrl', data)
            navigate(getHomeRouteForLoggedInUser(data))
          }, 3000)
          return () => clearTimeout(timer)
        },
        error: (err) => {
          log('err', err)
          if (err?.data?.data) {
            // clear entered otp
            setValue('otp', '')
          }
        }
      })
    }
  }

  const onSubmit = (jsonData, invalid, forOtp = false) => {
    if (isValid(jsonData)) {
      if (isValid(jsonData?.otp)) {
        otpAPi(jsonData)
      } else {
        loginApi({
          jsonData: {
            ...jsonData,
            email: base64Encode(jsonData?.email),
            password: base64Encode(jsonData?.password),
            logout_from_all_devices: jsonData?.logout_from_all_devices === 1 ? 'yes' : 'no'
          },
          loading: setLoading,
          success: (res) => {
            setSentOtp(true)
            setResendOtpTime(60)
            setOtpSentClicked(false)

            if (forOtp) {
              SuccessToast(FM('otp-sent-successfully'))
            }
          },
          error: (err) => {
            log('err', err)
            if (err?.data?.data) {
              setIsLogin(err?.data?.data)
              setTime(err?.data?.data?.time)
            }
            if (err?.data?.data?.account_locked) {
              setIsLocked(true)
            }
          }
        })
      }
    }
  }

  useEffect(() => {
    if (sentOtp) {
      if (resendOtpTime > 0) {
        const timer = setTimeout(() => {
          setResendOtpTime(resendOtpTime - 1)
        }, 1000)
        return () => clearTimeout(timer)
      } else {
        setResendOtpTime(0)
      }
    }
  }, [sentOtp, resendOtpTime])

  const d = new Date()
  let year = d.getFullYear()

  // Create a function to logout from all devices
  const logoutFromAllDevices = useCallback(() => {
    // Emit the event to logout from all devices
    Emitter.emit('logoutFromAllDevices')
  }, [])

  // Logout from all devices
  useEffect(() => {
    logoutFromAllDevices()
  }, [logoutFromAllDevices])

  // reduce time by 1 every second and set the time to 0 if it reaches 0
  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => {
        setTime(time - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setTime(600)
      setIsLocked(false)
    }
  }, [time])

  function convertSecToMinSec(sec) {
    let hours = Math.floor(sec / 3600) // Convert seconds to hours
    let remainingSec = sec % 3600 // Get the remaining seconds
    let min = Math.floor(remainingSec / 60) // Convert remaining seconds to minutes
    let remainingMin = remainingSec % 60 // Get the remaining minutes
    let formattedHours = hours < 10 ? '0' + hours : hours // Add leading zero if hours is less than 10
    let formattedMin = min < 10 ? '0' + min : min // Add leading zero if minutes is less than 10
    let formattedSec = remainingMin < 10 ? '0' + remainingMin : remainingMin // Add leading zero if seconds is less than 10
    let time = formattedMin + ':' + formattedSec // Format the time in hh:mm:ss format
    return time
  }

  return (
    <div className=''>
      <div className='login-bg'>
        <Container fluid>
          <Row className='position-absolute'>
            <Col md='8' className='offset-4'>
              <img src={logoImage} className='logo-image' alt='Login V1' />
            </Col>
          </Row>
          <Row className='d-flex align-items-center full-height'>
            <Col
              md='4'
              className=' offset-2 content-center d-flex justify-content-end d-none d-md-block'
            >
              <img src={backgroundImage} className='img-fluid' alt='Login V1' />
            </Col>
            <Col md='3' sm='6' className='offset-md-1 offset-sm-3'>
              <div className='mb-0'>
                <div>
                  <CardText tag='h1' className='mb-5 text-light text-center'>
                    {/* {FM('dpr-login')} */}
                    {appData?.app_name}
                  </CardText>
                  <Show IF={isLocked}>
                    <Alert>
                      <div className='text-center'>
                        <h4 className='text-danger'>{FM('account-locked')}</h4>

                        {convertSecToMinSec(time)}
                      </div>
                    </Alert>
                  </Show>
                  <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                    <FormGroupCustom
                      control={control}
                      name='email'
                      type='email'
                      isDisabled={sentOtp}
                      noLabel
                      className={'mb-1'}
                      rules={{ required: true, pattern: Patterns.EmailOnly }}
                      label={FM('email')}
                    />
                    <div className='d-flex justify-content-between'>
                      <Label className='form-label' for='login-password'></Label>
                      <Link to='/forgot-password' style={{ color: 'white' }}>
                        <small>{FM('forgot-password')}?</small>
                      </Link>
                    </div>
                    <FormGroupCustom
                      control={control}
                      name='password'
                      type='password'
                      className={'mb-1'}
                      isDisabled={sentOtp}
                      rules={{ required: true }}
                      noLabel
                    />
                    <Show IF={isLogin?.is_logged_in === true}>
                      <FormGroupCustom
                        control={control}
                        name='logout_from_all_devices'
                        type='checkbox'
                        className={'mb-1 text-primary'}
                        isDisabled={sentOtp}
                        rules={{ required: false }}
                        onClick={() => {
                          setValue('logout_from_all_devices', !watch('logout_from_all_devices'))
                        }}
                        label={FM('logout-all-devices')}
                      />
                    </Show>
                    <Row>
                      <Show IF={sentOtp}>
                        <Col>
                          <FormGroupCustom
                            control={control}
                            name='otp'
                            type='text'
                            placeholder={FM('enter-otp')}
                            className={'mb-1'}
                            rules={{ required: false }}
                            noLabel
                          />

                          <LoadingButton
                            loading={otpSentClicked && loading}
                            disabled={resendOtpTime > 0}
                            color={'dark'}
                            size={'sm'}
                            className={' mb-1 '}
                            onClick={() => {
                              setValue('otp', '')
                              setOtpSentClicked(true)
                              handleSubmit((onValid) => onSubmit(onValid, null, true))()
                            }}
                          >
                            {FM('resend-otp')} {resendOtpTime > 0 ? `(${resendOtpTime})` : ''}
                          </LoadingButton>
                        </Col>
                      </Show>
                    </Row>
                    <LoadingButton
                      loading={otpSentClicked ? false : loading}
                      className='mb-1 mt-1'
                      color='info'
                      disabled={sentOtp ? !isValid(watch('otp')) : false}
                      block
                    >
                      {sentOtp ? FM('submit') : FM('submit-via-otp')}
                    </LoadingButton>
                    {lamda === true ? showMessages() : ''}
                  </Form>
                </div>
                <div className='text-center mb-5 text-light'>in-fmpivotsupport@kpmg.com</div>
                <div className='copy small mt-5 text-light '>
                  © {year} {''}
                  {FM('copyright')}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

const LoginBasic = () => {
  useEffect(() => {
    if (!isDebug) {
      document.addEventListener('contextmenu', (event) => event.preventDefault())

      document.onkeydown = function (e) {
        // disable F12 key
        if (e.keyCode == 123) {
          return false
        }

        // disable I key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
          return false
        }

        // disable J key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
          return false
        }

        // disable U key
        if (e.ctrlKey && e.keyCode == 85) {
          return false
        }
      }
    }
    return () => {
      document.removeEventListener('contextmenu', () => {})
    }
  }, [])
  return (
    //   <GoogleReCaptchaProvider reCaptchaKey='6LcsC_gkAAAAAHbpA0PZL52J4xwLL-jjWv_B19aK'>
    <LoginWithCaptcha />
    //   </GoogleReCaptchaProvider>
  )
}

export default LoginBasic
