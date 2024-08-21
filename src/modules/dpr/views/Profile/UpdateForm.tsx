/* eslint-disable no-mixed-operators */
import '@styles/react/apps/app-users.scss'

import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import { stateReducer } from '@src/utility/stateReducer'
import { FM, isValid, SuccessToast } from '@src/utility/Utils'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Form, Label, Row } from 'reactstrap'

import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { handleLogin } from '@src/redux/authentication'
import { Patterns, UserType } from '@src/utility/Const'
import useUserType from '@src/utility/hooks/useUserType'
import { DPR } from '@src/utility/types/typeDPR'
import { fillObject, getUserData, setValues } from '@src/utility/Utils'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetProfileMutation, useUpdateProfileMutation } from '../../redux/RTKQuery/ProfileRTK'
import { getPath } from '@src/router/RouteHelper'
import SimpleImageUpload from '@src/modules/common/components/SimpleImageUpload'

interface States {
  category?: boolean
  subcategory?: boolean
  language?: any
  search?: any
  ip?: boolean
  patient?: boolean
  loading?: boolean
  text?: string
  zoom?: number
  address?: DPR
  list?: any
  active?: string
  formData?: DPR
}
const AddUpdateForm = () => {
  const user = getUserData()
  const params = useParams()
  const nav = useNavigate()
  const userType = useUserType()
  const form = useForm<DPR>()
  const { handleSubmit, control, reset, setValue, watch } = form
  const [loading, setLoading] = useState(false)

  const initState: States = {
    category: false,
    subcategory: false,
    ip: false,
    patient: false,
    loading: false,
    search: '',
    language: [],
    text: '',
    list: [],
    active: '1',
    zoom: 20,
    formData: {
      password: null,
      name: null,
      mobile_number: null
    }
  }
  const reducers = stateReducer<States>
  const dispatch = useDispatch()
  const [state, setState] = useReducer(reducers, initState)
  const [updateProfile, result] = useUpdateProfileMutation()
  const [loadProfile, { data, isSuccess, isLoading, isError }] = useGetProfileMutation()

  const onSubmit = (e: DPR) => {
    updateProfile({
      ...e
    })
  }

  useEffect(() => {
    if (result?.isSuccess) {
      const re = result?.data?.data as any
      dispatch(
        handleLogin({
          ...user,
          //   avatar: re?.avatar,
          address: re?.full_address,
          name: re?.name,
          mobile_number: re?.mobile_number,
          email: re?.email
        })
      )
    }
  }, [result?.isSuccess])

  useEffect(() => {
    if (result.isSuccess) {
      // SuccessToast('Profile Updated Successfully')
      nav(-1)
    }
  }, [result])

  useEffect(() => {
    if (isValid(params?.id)) {
      loadProfile({})
    }
  }, [params?.id])

  useEffect(() => {
    if (isSuccess) {
      const f = fillObject<DPR>(state?.formData, user)
      const formData: DPR = {
        ...f,
        name: data?.data?.name,
        address: data?.data?.address,
        email: data?.data?.email,
        mobile_number: data?.data?.mobile_number
        // avatar: data?.data?.avatar
      }

      setValues<DPR>(formData, setValue)
    }
  }, [isSuccess])

  return (
    <>
      <Header
        goBackTo={getPath('dpr.profile')}
        onClickBack={() => nav(-1)}
        title={FM('update-profile')}
      ></Header>
      {loading ? (
        <>
          <Card>
            <CardBody>
              <Row>
                <Col md='12' className='mt-2'>
                  <Shimmer style={{ height: 320 }} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Card>
                <CardBody className='pt-1'>
                  <Row>
                    {/* <Col md='2'>
                      <div>
                        <Label>{FM('avatar')}</Label>
                      </div>
                      <SimpleImageUpload
                        style={{ width: 150, height: 120 }}
                        value={watch('avatar')}
                        name={`avatar`}
                        className='mb-2'
                        setValue={setValue}
                      />
                    </Col> */}
                    <Col>
                      <Row>
                        <Col md='4'>
                          <FormGroupCustom
                            label={FM('name')}
                            name={'name'}
                            type={'text'}
                            className='mb-2'
                            control={control}
                            rules={{
                              required: true,
                              pattern: Patterns.AlphaNumericForUser,
                              maxLength: 50
                            }}
                          />
                        </Col>
                        <Col md='4'>
                          <FormGroupCustom
                            label={FM('email')}
                            isDisabled={isValid(params?.id)}
                            name={'email'}
                            type={'email'}
                            className='mb-2'
                            control={control}
                            rules={{ required: true, pattern: Patterns.EmailOnly }}
                          />
                        </Col>
                        <Col md='4'>
                          <FormGroupCustom
                            name={'mobile_number'}
                            type={'number'}
                            label={FM('mobile-number')}
                            className='mb-2'
                            control={control}
                            rules={{ required: false, minLength: 10, maxLength: 13, min: 0 }}
                          />
                        </Col>
                        <Col md='8'>
                          <FormGroupCustom
                            label={FM('address')}
                            name={'address'}
                            type={'text'}
                            className='mb-2'
                            control={control}
                            rules={{ required: false }}
                          />
                        </Col>
                        <Col sm='4' className=''>
                          <LoadingButton
                            block
                            loading={result.isLoading}
                            className='mt-2'
                            color='primary'
                            type='submit'
                          >
                            <>{FM('update')}</>
                          </LoadingButton>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row></Row>
                </CardBody>
              </Card>
            </Row>
          </Form>
        </>
      )}
    </>
  )
}

export default AddUpdateForm
