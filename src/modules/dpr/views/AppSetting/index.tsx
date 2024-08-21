import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import SimpleImageUpload from '@src/modules/common/components/SimpleImageUpload'
import { updateAppName } from '@src/redux/authentication'
import { useAppDispatch } from '@src/redux/store'
import { getPath } from '@src/router/RouteHelper'
import { Patterns } from '@src/utility/Const'
import Emitter from '@src/utility/Emitter'
import useUser from '@src/utility/hooks/useUser'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import { fillObject, FM, isValid, log, setValues, SuccessToast } from '@src/utility/Utils'
import { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ButtonGroup, Card, CardBody, CardHeader, Col, Row, Form, Label } from 'reactstrap'
import { useGetSettingMutation, useUpdateSettingMutation } from '../../redux/RTKQuery/ProfileRTK'

interface States {
  lastRefresh?: any
  random?: any
  loading?: boolean
  text?: string
  list?: any
  active?: string
  formData?: DPR | any
}
function AppSetting() {
  const initState: States = {
    lastRefresh: new Date().getTime(),
    random: null,
    loading: false,
    text: '',
    list: [],
    active: '1',
    formData: {
      id: null,
      app_name: null,
      description: null,
      email: null,
      mobile_no: null,
      app_logo: null,
      log_expiry_days: null,
      address: null,
      disclaimer_text: null
    }
  }
  const params = useParams()
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const form = useForm<DPR>()
  const { handleSubmit, control, reset, setValue, watch } = form
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [loadSetting, { data, isSuccess, isLoading, isError }] = useGetSettingMutation()
  const [updateSetting, result] = useUpdateSettingMutation()

  const appData = data?.data

  const onSubmit = (e: DPR) => {
    updateSetting({
      ...e
    })
  }

  useEffect(() => {
    if (result.isSuccess) {
      dispatch(
        updateAppName({
          app_name: result?.data?.data?.app_name,
          app_logo: result?.data?.data?.app_logo
        })
      )
      // SuccessToast('App Setting Updated Successfully')
    }
  }, [result])

  useEffect(() => {
    loadSetting({})
  }, [])

  useEffect(() => {
    if (isValid(appData) && appData !== undefined) {
      const f = fillObject<DPR>(state.formData, appData)
      const formData: DPR = {
        ...f,
        app_logo: f?.app_logo
      }
      setValues<DPR>(formData, setValue)
    }
  }, [appData])

  useEffect(() => {
    Emitter.emit('reloadLogs', true)
  }, [])

  return (
    <>
      <Header goBackTo={getPath('dashboard')} onClickBack={() => nav(-1)} title={FM('app-setting')}>
        <ButtonGroup>
          <></>
        </ButtonGroup>
      </Header>
      {isLoading ? (
        <>
          <Card className='mb-0 h-100'>
            <CardHeader>
              <Shimmer width={'280px'} height={'100px'} />
            </CardHeader>

            <CardBody>
              <div className='info-container'>
                <>
                  <ul className='list-unstyled'>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                    <li className='mb-75'>
                      <Shimmer height={'60px'} />
                    </li>
                  </ul>
                </>
              </div>
            </CardBody>
          </Card>
        </>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card className='mb-0 h-100'>
            <CardBody>
              <Row className='list-unstyled'>
                <Col md='2'>
                  <div>
                    <Label>{FM('app-logo')}</Label>
                  </div>
                  <SimpleImageUpload
                    style={{ width: 150, height: 200 }}
                    value={watch('app_logo')}
                    name={`app_logo`}
                    className='mb-2'
                    setValue={setValue}
                  />
                </Col>
                <Col md='10'>
                  <Row>
                    <Col md='6'>
                      <FormGroupCustom
                        label={FM('app-name')}
                        name={'app_name'}
                        type={'text'}
                        className='mb-2'
                        control={control}
                        rules={{ required: true, maxLength: 50 }}
                      />
                    </Col>
                    <Col md='6'>
                      <FormGroupCustom
                        label={FM('contact-email')}
                        // isDisabled={isValid(appData)}
                        name={'email'}
                        type={'email'}
                        className='mb-2'
                        control={control}
                        rules={{ required: true, pattern: Patterns.EmailOnly }}
                      />
                    </Col>
                    <Col md='6'>
                      <FormGroupCustom
                        name={'mobile_no'}
                        type={'number'}
                        label={FM('contact-mobile-number')}
                        className='mb-2'
                        control={control}
                        rules={{ required: false, minLength: 10, maxLength: 13, min: 0 }}
                      />
                    </Col>
                    <Col md='6'>
                      <FormGroupCustom
                        label={FM('log-expiry-days')}
                        name={'log_expiry_days'}
                        type={'text'}
                        className='mb-2'
                        control={control}
                        rules={{ required: false }}
                      />
                    </Col>
                    <Col md='6'>
                      <FormGroupCustom
                        label={FM('contact-address')}
                        name={'address'}
                        type={'text'}
                        className='mb-2'
                        control={control}
                        rules={{ required: false }}
                      />
                    </Col>
                    <Col md='6'>
                      <FormGroupCustom
                        label={FM('disclaimer')}
                        name={'disclaimer_text'}
                        type={'textarea'}
                        className='mb-2'
                        control={control}
                        rules={{ required: false }}
                      />
                    </Col>
                    <Col sm='3' className='mt-2'>
                      <LoadingButton
                        block
                        loading={result.isLoading}
                        className=''
                        color='primary'
                        type='submit'
                        onClick={() => Emitter.emit('reloadLogs', true)}
                      >
                        <>{FM('update')}</>
                      </LoadingButton>
                    </Col>
                    {/* <Col md='6'>
                      <FormGroupCustom
                        label={FM('description')}
                        name={'description'}
                        type={'textarea'}
                        className='mb-2'
                        control={control}
                        rules={{ required: false }}
                      />
                    </Col> */}
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Form>
      )}
    </>
  )
}

export default AppSetting
