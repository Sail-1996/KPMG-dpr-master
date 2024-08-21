// ** React Imports
import { Link, useNavigate, useParams } from 'react-router-dom'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Custom Components
import InputPassword from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Button, Col } from 'reactstrap'

// app logo
import { ReactComponent as AppLogo } from '@@assets/images/logo/logo.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { FM, generatePasswordAx, log } from '@src/utility/Utils'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { resetPasswordApi, sendResetLinkApi, updatePasswordApi } from '@src/utility/http/Apis/auth'
import FormGroupCustom from '@modules/common/components/formGroupCustom/FormGroupCustom'
import { Patterns } from '@src/utility/Const'
import LoadingButton from '@modules/common/components/buttons/LoadingButton'
import useUser from '@hooks/useUser'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSkin } from '@hooks/useSkin'
import { useGetSettingMutation } from '@src/modules/dpr/redux/RTKQuery/ProfileRTK'

const ResetPasswordBasic = () => {
  const navigate = useNavigate()
  const params = useParams()
  const User = useUser()
  const roleName = User?.roles?.name
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState(null)
  const {
    control,
    setError,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const { skin } = useSkin()
  // Load App Settings
  const [loadSetting, { data, isSuccess, isLoading, isError }] = useGetSettingMutation()

  useEffect(() => {
    loadSetting()
  }, [])

  const appData = data?.data

  const onSubmit = (jsonData) => {
    if (jsonData.password === jsonData?.confirm_password) {
      updatePasswordApi({
        jsonData: {
          ...jsonData,
          token: params?.token ?? ''
        },
        loading: setLoading,
        success: (res) => {
          SuccessToast(res?.message)
          const baseUrl = import.meta.env.BASE_URL

          window.location.href = baseUrl + '/login'
        }
      })
    } else {
      setError('confirm_password', { type: 'validate', message: FM('password-did-not-matched') })
    }
  }

  const checkPassword = (password) => {
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g
    const re = []
    const p = String(password)

    const length = roleName === 'Admin' ? 15 : 8

    if (p.length >= length) {
      // check if p contain at least one lowercase letter
      re.push(p.match(lowerCaseLetters))
      // check if p contain at least one uppercase letter
      re.push(p.match(upperCaseLetters))
      // check if p contain at least one numeric digit
      re.push(p.match(numbers))
      // check if p contain at least one special character
      re.push(p.match(specialCharacters))
    } else {
      return false
    }
    // check if any three of the four conditions are met
    return re.filter((e) => e).length >= 3
  }

  const generatePassword = async () => {
    const length = roleName === 'Admin' ? 15 : 8

    // const randomPassword = String(encrypt(new Date().getTime().toString())).replaceAll('=', '')
    const randomPassword = generatePasswordAx(length)

    if (checkPassword(randomPassword)) {
      setPassword(randomPassword)
      setValue('password', randomPassword)
      setValue('confirm_password', randomPassword)
    } else {
      generatePassword()
    }
    navigator?.clipboard
      ?.writeText(randomPassword)
      .then(() => {
        toast('Password copied to your clipboard')
      })
      .catch(() => {
        toast.error('Password could not be copied to your clipboard')
      })
  }

  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
              {/* <AppLogo /> */}
              <span className={`brand-logo ${skin === 'dark' ? 'text-light' : 'text-primary'}`}>
                <img
                  src={appData?.app_logo}
                  style={{
                    height: 15,
                    width: 'auto'
                  }}
                />
              </span>
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              {FM('reset-password')} 🔒
            </CardTitle>
            <CardText className='mb-2'>
              {FM('your-new-password-must-be-different-from-previously-used-passwords')}
            </CardText>
            <Form className='auth-reset-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroupCustom
                rules={{ required: true, validate: checkPassword }}
                control={control}
                name='password'
                tooltip={FM('please-enter-password-more-than-6-character')}
                type='password'
                label={FM('password')}
                className='mb-1'
              />
              <FormGroupCustom
                rules={{ required: true, validate: checkPassword }}
                control={control}
                name='confirm_password'
                type='password'
                label={FM('confirm-password')}
                className='mb-1'
              />
              <Col md='6' className='mb-2'>
                <LoadingButton
                  block
                  loading={false}
                  className='mt-2'
                  color='primary'
                  onClick={generatePassword}
                >
                  <>{FM('generate-password')}</>
                </LoadingButton>
                <ToastContainer />
              </Col>
              <LoadingButton loading={loading} color='primary' block>
                {FM('set-new-password')}
              </LoadingButton>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/login'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>{FM('back-to-login')}</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordBasic
