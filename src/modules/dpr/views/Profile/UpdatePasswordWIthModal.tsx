import useUser from '@hooks/useUser'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import CenteredModal from '@src/modules/common/components/modal/CenteredModal'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import {
  encrypt,
  fillObject,
  FM,
  generatePasswordAx,
  getUserData,
  isValid,
  setValues
} from '@src/utility/Utils'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CardBody, Col, Row } from 'reactstrap'
import { useUpdatePasswordMutation } from '../../redux/RTKQuery/ProfileRTK'

export type CategoryParamsType = {
  id?: string
  name: string
  status?: string
  patent_id?: string
}
interface dataType {
  edit?: any
  response?: (e: boolean) => void
  noView?: boolean
  showModal?: boolean
  setShowModal?: (e: boolean) => void
  Component?: any
  loading?: boolean
  children?: any

  // rest?: any
}
interface States {
  loading?: boolean
  text?: string
  formData?: DPR
}

export default function UpdatePassword<T>(props: T & dataType) {
  const {
    edit = null,
    noView = false,
    showModal = false,

    setShowModal = () => {},
    Component = 'span',
    response = () => {},
    children = null,
    ...rest
  } = props
  const initState: States = {
    loading: false,

    formData: {
      password: null,
      name: null
    }
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(false)
  const User = useUser()
  const roleName = User?.roles?.name
  const form = useForm<DPR>()
  const user = getUserData()
  const [password, setPassword] = useState<any>(null)
  const {
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset
  } = form

  const openModal = () => {
    setOpen(true)
  }
  const closeModal = (from = null) => {
    setOpen(false)
    setShowModal(false)
    reset()
  }
  const [updatePassword, result] = useUpdatePasswordMutation()
  const handleSave = (d: DPR) => {
    updatePassword({
      jsonData: {
        ...d
      }
    })
  }

  useEffect(() => {
    if (result.isSuccess) {
      closeModal()
      reset()
    }
  }, [result.isSuccess])

  useEffect(() => {
    if (noView && showModal) {
      openModal()
    }
  }, [noView, showModal])
  useEffect(() => {
    if (isValid(user) && user !== undefined) {
      const f = fillObject<DPR>(state?.formData, user)
      const formData: DPR = {
        token: user?.token
      }
      setValues<DPR>(formData, setValue)
    }
  }, [user])

  // check if password contain at least one lowercase letter or one uppercase letter or one numeric digit or and one special character and is eight characters or longer, check if any three of the four conditions are met
  const checkPassword = (password: string) => {
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g
    const re: any[] = []
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
    <>
      {!noView ? (
        <Component role='button' onClick={openModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        scrollControl={false}
        modalClass='modal-sm'
        disableSave={watch('confirm_password') !== watch('password')}
        loading={result.isLoading}
        open={open}
        handleModal={closeModal}
        handleSave={handleSubmit(handleSave)}
        title={FM('update-password')}
      >
        <form>
          <CardBody className='p-1'>
            <Row>
              <Col md='12' className=''>
                <FormGroupCustom
                  type={'password'}
                  control={control}
                  name='old_password'
                  className='mb-1'
                  label={FM('old-password')}
                  rules={{ required: true }}
                />
              </Col>
              <Col md='12' className=''>
                <FormGroupCustom
                  type={'password'}
                  control={control}
                  name='password'
                  className='mb-1'
                  label={FM('password')}
                  defaultValue={password}
                  rules={{ required: true, validate: checkPassword }}
                />
              </Col>
              <Col md='12' className='mb-2'>
                <FormGroupCustom
                  type={'password'}
                  control={control}
                  name='confirm_password'
                  label={FM('confirm-password')}
                  rules={{ required: true, validate: checkPassword }}
                />
              </Col>
              <Col md='12'>
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
            </Row>
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
