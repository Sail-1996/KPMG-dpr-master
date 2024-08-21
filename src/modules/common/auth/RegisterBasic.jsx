// ** React Imports
import { Link } from 'react-router-dom'

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'

// app logo
import { ReactComponent as AppLogo } from '@@assets/images/logo/logo.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { FM } from '@src/utility/Utils'
import { useForm } from 'react-hook-form'
import FormGroupCustom from '@modules/common/components/formGroupCustom/FormGroupCustom'

const RegisterBasic = () => {
  const form = useForm()
  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
              <AppLogo />
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              {FM('adventure-starts-here')}🚀
            </CardTitle>
            <CardText className='mb-2'>Make your app management easy and fun!</CardText>
            <Form className='auth-register-form mt-2' onSubmit={(e) => e.preventDefault()}>
              <FormGroupCustom
                control={form.control}
                name='email'
                type='text'
                className={'mb-1'}
                label={FM('email')}
              />
              <FormGroupCustom
                control={form.control}
                name='password'
                type='text'
                className={'mb-1'}
                label={FM('password')}
              />
              <FormGroupCustom
                control={form.control}
                name='confirm_password'
                type='text'
                className={'mb-1'}
                label={FM('confirm-password')}
              />
              <div className='form-check mb-1'>
                {/* <Input type='checkbox' id='terms' /> */}
                <FormGroupCustom
                  control={form.control}
                  name='terms'
                  type='checkbox'
                  //   className={'mb-1'}
                  noGroup
                  label={
                    <>
                      {FM('i-agree-to')}
                      <a className='ms-25' href='/' onClick={(e) => e.preventDefault()}>
                        {FM('privacy-policy')} & {FM('terms')}
                      </a>
                    </>
                  }
                />
              </div>
              <Button color='primary' block>
                {FM('sign-up')}
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>{FM('already-have-an-account')}</span>
              <Link to='/pages/login-basic'>
                <span>{FM('sign-in')}</span>
              </Link>
            </p>
            {/* <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div> */}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default RegisterBasic
