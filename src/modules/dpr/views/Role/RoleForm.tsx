import '@styles/react/apps/app-users.scss'

import { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Form, Input, Label, Row } from 'reactstrap'
import { getPath } from '@src/router/RouteHelper'
import { FM, isValid, log, SuccessToast } from '@src/utility/Utils'
import useUserType from '@src/utility/hooks/useUserType'
import { stateReducer } from '@src/utility/stateReducer'
import { fastLoop } from '@src/utility/Utils'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useCreateOrUpdateRoleMutation } from '../../redux/RTKQuery/RoleRTK'
import { DPR } from '@src/utility/types/typeDPR'
import { useLoadPermissionMutation } from '../../redux/RTKQuery/PermissionRTK'
import { Info } from 'react-feather'
import BsTooltip from '@src/modules/common/components/tooltip'
import { Patterns } from '@src/utility/Const'

interface States {
  loading?: boolean | null
  text?: string | null
  list?: any | null
  active?: string | null
  permissions?: DPR | null
  allPermissions?: any | null
  selectedPermissions?: any | null
  formData?: any | null
  checkedAll?: boolean | null
}

const RolesForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const userType = useUserType()
  const editData: any = location.state

  const form = useForm<DPR>()
  const { handleSubmit, control, reset, setValue, watch } = form

  const [loadPermission, { data, error, isLoading }] = useLoadPermissionMutation()

  useEffect(() => {
    loadPermission({})
  }, [])

  const initState: States = {
    loading: false,
    active: '1',
    text: '',
    list: [],
    selectedPermissions: []
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [createRole, result] = useCreateOrUpdateRoleMutation()

  const fetchPermissions = (type: any) => {
    if (isValid(type)) {
      setState({ permissions: null })
      log('sdxxxxxxxxxxxxxxxsdf')

      const selected: any = []
      const permission: any = {}
      const resp: any = data?.data

      fastLoop(resp, (per, i) => {
        if (permission[per?.group_name] === undefined) {
          permission[per?.group_name] = []
        }
        if (per?.entry_mode === 'required') {
          selected.push(per?.id)
        } else {
          if (editData?.permissions) {
            editData?.permissions?.map((p: any) => {
              if (p?.id === per?.id) {
                selected.push(p?.id)
              }
            })
          }
        }
        permission[per?.group_name].push(per)
      })

      setState({ allPermissions: data?.data, permissions: permission })

      if (editData?.permissions) {
        setState({ selectedPermissions: selected })
      }
    }
  }

  useEffect(() => {
    if (data?.data) {
      log('sdsdf')
      fetchPermissions('ghgh')
    }
  }, [data, userType])

  const onSubmit = (e: DPR) => {
    const ids: number[] = state?.selectedPermissions

    // check if selPer has dpr-direct, dpr-map, dpr-config, dpr-import, dpr-log
    // find id of dpr-direct
    const dprDirect = state?.allPermissions?.find((p: any) => p?.se_name === 'dpr-direct')
    const dprMap = state?.allPermissions?.find((p: any) => p?.se_name === 'dpr-map')
    const dprConfig = state?.allPermissions?.find((p: any) => p?.se_name === 'dpr-config')
    const dprImport = state?.allPermissions?.find((p: any) => p?.se_name === 'dpr-import')
    const dprLog = state?.allPermissions?.find((p: any) => p?.se_name === 'dpr-log')

    const dprConfigBrowse = state?.allPermissions?.find(
      (p: any) => p?.se_name === 'dpr-config-browse'
    )
    const dprInterfaceBrowse = state?.allPermissions?.find(
      (p: any) => p?.se_name === 'interface-browse'
    )

    // add if any of the bellow permission is selected
    if (ids.includes(dprDirect?.id) || ids.includes(dprImport?.id)) {
      ids.push(dprInterfaceBrowse?.id)
    }

    // remove if no permission is selected
    if (!ids.includes(dprDirect?.id) && !ids.includes(dprImport?.id)) {
      const i = ids.findIndex((p: any) => p === dprInterfaceBrowse?.id)

      if (i !== undefined && i > -1) {
        ids.splice(i, 1)
      }
    }

    // add if any of the bellow permission is selected
    if (ids.includes(dprMap?.id) || ids.includes(dprConfig?.id) || ids.includes(dprLog?.id)) {
      ids.push(dprConfigBrowse?.id)
    }

    // remove if no permission is selected
    if (!ids.includes(dprMap?.id) && !ids.includes(dprConfig?.id) && !ids.includes(dprLog?.id)) {
      const i = ids.findIndex((p: any) => p === dprConfigBrowse?.id)

      if (i !== undefined && i > -1) {
        ids.splice(i, 1)
      }
    }

    // remove duplicate ids
    const uniqueIds = [...new Set(ids)]

    if (isValid(editData)) {
      createRole({
        ...editData,
        ...e,
        permissions: uniqueIds,
        user_type_id: userType
      })
    } else {
      createRole({ ...e, permissions: uniqueIds, user_type_id: userType })
    }
  }

  useEffect(() => {
    if (result.isSuccess) {
      // SuccessToast(FM('executed-successfully'))
      navigate(getPath('dpr.role'))
    }
  }, [result])
  useEffect(() => {
    if (editData?.se_name) {
      setValue('se_name', editData?.se_name)
    }
  }, [editData])
  const toggleAllPermission = () => {
    const getIds = state.allPermissions?.map((d: any) => d?.id)
    // log(getIds)
    if (state?.checkedAll) {
      setState({ selectedPermissions: [] })
      setState({ checkedAll: false })
    } else {
      setState({ selectedPermissions: getIds })
      setState({ checkedAll: true })
    }
  }

  const togglePermission = (permission: any) => {
    const i = state.selectedPermissions?.findIndex((p: any) => p === permission?.id)
    if (i === -1) {
      if (permission) {
        setState({ selectedPermissions: [...state.selectedPermissions, permission?.id] })
      }
    } else {
      const per = state.selectedPermissions ?? []
      per.splice(i, 1)

      setState({ selectedPermissions: [...per] })
    }
  }

  const isChecked = (permission: any) => {
    const i = state?.selectedPermissions?.findIndex((p: any) => p === permission?.id)

    if (i !== undefined && i > -1) {
      return true
    } else {
      return false
    }
  }
  // remove group_name prefix from permission name
  const removeGroupNamePrefix = (permission: any): any => {
    if (permission?.name) {
      const name: string = permission?.name
      const groupName = permission?.group_name
      if (isValid(name) && isValid(groupName)) {
        return name.replace(groupName + '-', '')
      }
      return name
    } else {
      return ''
    }
  }

  const renderPermissions = (per = []) => {
    const re: any = []
    // log('per', per)
    if (per) {
      per.forEach((permission: any, index) => {
        if (
          permission.se_name !== 'interface-browse' &&
          permission.se_name !== 'dpr-config-browse'
        ) {
          const displayName: any = removeGroupNamePrefix(permission) + '-permission'
          re.push(
            <>
              <div className='form-check form-check-inline'>
                <Input
                  // disabled={permission?.entry_mode === "required"}
                  checked={isChecked(permission)}
                  id={permission?.se_name}
                  type={'checkbox'}
                  onChange={(e) => {
                    togglePermission(permission)
                    log(permission)
                    // if (permission?.se_name === 'dpr-direct') {
                    //   setTimeout(() => {
                    //     // find id of dpr-config-browse
                    //     const perM = state?.allPermissions?.find(
                    //       (p: any) => p?.se_name === 'dpr-config-browse'
                    //     )
                    //     togglePermission(perM)
                    //   }, 500)
                    // }

                    // if (permission?.se_name === 'interface-browse') {
                    // }
                  }}
                />
                <Label className='text-capitalize' for={permission?.se_name}>
                  {removeGroupNamePrefix(permission)}{' '}
                  <BsTooltip title={FM(displayName, { type: permission?.group_name })}>
                    <Info size={14} />
                  </BsTooltip>{' '}
                </Label>
              </div>
            </>
          )
        }
      })
    }
    return re
  }
  log('permission', state.selectedPermissions)
  const renderGroups = () => {
    const re: any[] = []
    if (state.permissions) {
      for (const [key, value] of Object.entries(state.permissions)) {
        re.push(
          <>
            <div className='mb-2'>
              <h5 className='border-bottom pb-1 pt-1 mb-1 text-capitalize'>{key}</h5>
              {renderPermissions(value)}
            </div>
          </>
        )
      }
    }
    return re
  }
  return (
    <>
      <Header
        onClickBack={() => navigate(-1)}
        goBackTo
        title={params?.id ? FM('update-role') : FM('create-role')}
      ></Header>
      {isLoading ? (
        <>
          <Row>
            <Col md='8' className=''>
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
            <Col md='4' className=''>
              <Card>
                <CardBody>
                  <Row>
                    <Col md='12'>
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
            <Row className=''>
              <Col md='8' className=''>
                <Card>
                  <CardHeader tag={'h4'}>
                    <h4 className='card-title'>{FM('add-role')}</h4>
                    <Button color='primary' className='round' onClick={toggleAllPermission}>
                      {state.checkedAll ? FM('uncheck-all') : FM('check-all')}
                    </Button>
                  </CardHeader>
                  <CardBody>
                    <h6>{FM('assign-permissions')}</h6>
                    {renderGroups()}
                  </CardBody>
                </Card>
              </Col>
              <Col md='4' className=''>
                <Card>
                  <CardHeader tag={'h4'}>{FM('role-name')}</CardHeader>
                  <CardBody>
                    <Row>
                      <Col md='12'>
                        <FormGroupCustom
                          control={control}
                          type={'text'}
                          noLabel
                          placeholder={FM('role-name')}
                          name={'se_name'}
                          rules={{
                            required: true,
                            pattern: Patterns.AlphaNumericWithAtperSpaceHash,
                            maxLength: 50
                          }}
                        />
                      </Col>
                    </Row>
                    <LoadingButton
                      block
                      type='submit'
                      className='mt-1'
                      loading={result.isLoading}
                      color='primary'
                    >
                      {FM('save')}
                    </LoadingButton>
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

export default RolesForm
