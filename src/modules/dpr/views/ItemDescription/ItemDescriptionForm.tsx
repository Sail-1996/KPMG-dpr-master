/* eslint-disable no-dupe-else-if */
/* eslint-disable no-mixed-operators */
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useAppDispatch } from '@src/redux/store'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import { fillObject, FM, isValid, setValues } from '@src/utility/Utils'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import {
  useCreateOrUpdateItemDescMutation,
  useLoadItemDescDetailsByIdMutation
} from '../../redux/RTKQuery/ItemDescRTK'

interface States {
  lastRefresh?: any
  random?: any
  loading?: boolean
  text?: string
  list?: any
  active?: string
  formData?: DPR | any
}

const ItemDescriptionForm = () => {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const params = useParams()
  const form = useForm<DPR>({
    defaultValues: {
      title: null
    }
  })
  const { handleSubmit, control, reset, setValue, watch } = form
  const [loading, setLoading] = useState(false)

  const initState: States = {
    lastRefresh: new Date().getTime(),
    random: null,
    loading: false,
    text: '',
    list: [],
    active: '1',
    formData: {
      title: null
    }
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)

  const [createItem, result] = useCreateOrUpdateItemDescMutation()
  const [getItem, { data, isSuccess, isLoading }] = useLoadItemDescDetailsByIdMutation()

  const getData: any = data?.data

  useEffect(() => {
    if (result.isSuccess) {
      reset()
    }
  }, [result])
  useEffect(() => {
    if (isValid(params?.id)) {
      getItem({
        id: params?.id
      })
    }
  }, [params?.id])

  useEffect(() => {
    if (isValid(getData) && getData !== undefined) {
      const f = fillObject<DPR>(state.formData, getData)
      const formData: DPR = {
        ...f
      }
      setValues<DPR>(formData, setValue)
    }
  }, [getData])

  const onSubmit = (e: DPR) => {
    if (isValid(params?.id)) {
      createItem({
        id: params?.id,
        ...e
      })
    } else {
      createItem({
        ...e
      })
    }
  }

  useEffect(() => {
    if (result?.isSuccess) {
      nav(-1)
    }
  }, [result?.isSuccess])

  const Reset = (e: DPR) => {
    reset()
  }

  return (
    <>
      <Header
        onClickBack={() => nav(-1)}
        goBackTo
        title={
          isValid(params?.id) ? FM('item-description-update') : <>{FM('item-description-create')}</>
        }
      ></Header>
      {loading ? (
        <>
          <Row>
            <Col md='12' className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Col md='6'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='6'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='12' className='mt-2'>
                      <Shimmer style={{ height: 320 }} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Col md='12' className=''>
                <Card>
                  <CardBody className='pt-2'>
                    <Row>
                      <Col md='6'>
                        <FormGroupCustom
                          name={'title'}
                          label={FM('title')}
                          type={'text'}
                          className='mb-2'
                          control={control}
                          rules={{
                            required: true
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className='d-flex justify-content-start'>
                      <Col md='3'>
                        <LoadingButton
                          block
                          loading={result.isLoading}
                          className='mt-2 mb-3'
                          color='primary'
                          type='submit'
                        >
                          <>{FM('save')}</>
                        </LoadingButton>
                      </Col>
                      <Col md='3'>
                        <LoadingButton
                          block
                          loading={false}
                          className='mt-2 mb-3'
                          color='warning'
                          type='reset'
                          onClick={(e: any) => {
                            Reset(e)
                          }}
                        >
                          <>{FM('reset')}</>
                        </LoadingButton>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  )
}

export default ItemDescriptionForm
