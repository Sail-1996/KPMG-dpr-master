import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'

import { FM } from '@src/utility/Utils'
import { stateReducer } from '@src/utility/stateReducer'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import SideModal from '@src/modules/common/components/sideModal/sideModal'
import { DPR } from '@src/utility/types/typeDPR'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'

interface States {
  loading?: boolean
  languageList?: any
  active?: any
  page?: any

  per_page_record?: any
  search?: any
}

interface propsType {
  userType?: any
  show?: boolean
  handleFilterModal?: any

  setFilterData?: any
  filterData?: any
}
const ConfigFilter = ({
  userType = null,

  show = false,
  handleFilterModal = () => {},
  setFilterData = {},
  filterData = {}
}: propsType) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm<DPR>()
  const initState: States = {
    loading: false,
    active: '1',
    page: 1,
    per_page_record: 100,
    search: undefined
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [open, setOpen] = useState(show)

  const submitFilter = (d: any) => {
    setFilterData(d)
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  return (
    <SideModal
      loading={state?.loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={FM('interface-filter')}
      done='filter'
    >
      {/* <Form> */}
      <FormGroupCustom
        placeholder={FM('profile-name')}
        type='text'
        name='profile_name'
        label={FM('profile-name')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />
      <FormGroupCustom
        label={FM('project')}
        name={'project_id'}
        type={'select'}
        className='mb-2'
        path={ApiEndpoints.list_project}
        selectLabel='name'
        selectValue={'id'}
        async
        defaultOptions
        loadOptions={loadDropdown}
        isClearable
        control={control}
        rules={{
          required: false
        }}
      />
      <FormGroupCustom
        label={FM('vendor')}
        name={'vendor_id'}
        type={'select'}
        className='mb-2'
        path={ApiEndpoints.list_vendor}
        selectLabel='name'
        selectValue={'id'}
        async
        defaultOptions
        loadOptions={loadDropdown}
        isClearable
        control={control}
        rules={{
          required: false
        }}
      />
      <FormGroupCustom
        label={FM('work-package')}
        name={'work_pack_id'}
        type={'select'}
        className='mb-2'
        path={ApiEndpoints.list_work_package}
        selectLabel='name'
        selectValue={'id'}
        async
        defaultOptions
        loadOptions={loadDropdown}
        isClearable
        control={control}
        rules={{
          required: false
        }}
      />
    </SideModal>
  )
}

export default ConfigFilter
