import Header from '@src/modules/common/components/header'
import TooltipLink from '@src/modules/common/components/tooltip/TooltipLink'
import { getPath } from '@src/router/RouteHelper'
import useUser from '@src/utility/hooks/useUser'
import useUserType from '@src/utility/hooks/useUserType'
import { FM, log } from '@src/utility/Utils'
import { useEffect } from 'react'
import { Edit, PenTool } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ButtonGroup, ButtonProps, Row } from 'reactstrap'
import { useGetProfileMutation } from '../../redux/RTKQuery/ProfileRTK'
import ProfileCard from './tabs/ProfileCard'
import UpdateProfile from './UpdatePasswordWIthModal'

function Profile() {
  const params = useParams()
  const nav = useNavigate()
  const [loadProfile, { data, isSuccess, isLoading, isError }] = useGetProfileMutation()
  const user = useUser()
  useEffect(() => {
    loadProfile({
      id: params?.id
    })
  }, [])

  log('authData', data?.data)

  return (
    <>
      <Header goBackTo={getPath('dashboard')} onClickBack={() => nav(-1)} title={FM('profile')}>
        <ButtonGroup>
          <UpdateProfile<ButtonProps> Component={Button} size='sm' color='secondary'>
            <Edit size='14' />
            <span className='align-middle ms-25'>{FM('update-password')}</span>
          </UpdateProfile>
          <TooltipLink
            title={<>{FM('update')}</>}
            to={getPath('dpr.profile.update', { id: data?.data?.id })}
            className='btn btn-primary btn-sm'
          >
            <>
              <PenTool size='14' />
              <span className='align-middle ms-25'>{FM('update-profile')}</span>
            </>
          </TooltipLink>
        </ButtonGroup>
      </Header>

      <Row className='mb-2 g-1'>
        <ProfileCard user={data?.data} loading={isLoading} />
      </Row>
    </>
  )
}

export default Profile
