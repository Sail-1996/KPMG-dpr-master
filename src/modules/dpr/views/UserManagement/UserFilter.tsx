import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'

import { FM } from '@src/utility/Utils'
import { stateReducer } from '@src/utility/stateReducer'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import SideModal from '@src/modules/common/components/sideModal/sideModal'
import { DPR } from '@src/utility/types/typeDPR'

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
const UserFilter = ({
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
      title={FM('user-filter')}
      done='filter'
    >
      {/* <Form> */}
      <FormGroupCustom
        placeholder={FM('name')}
        type='text'
        name='name'
        label={FM('name')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />
      <FormGroupCustom
        placeholder={FM('mobile-number')}
        type='number'
        name='mobile_number'
        label={FM('mobile-number')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />
      <FormGroupCustom
        placeholder={FM('email')}
        type='email'
        name='email'
        label={FM('email')}
        className='mb-1'
        control={control}
        rules={{ required: false }}
      />
    </SideModal>
  )
}

export default UserFilter
