import { RenderHeaderMenu } from '@src/utility/context/RenderHeader'
import { FM, log } from '@src/utility/Utils'
import { useModal } from '@src/modules/common/components/modal/HandleModal'
import BsTooltip from '@src/modules/common/components/tooltip'
import React, { useContext, useEffect } from 'react'
import { UserPlus } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'
import { useLoadCategoryMutation } from '@modules/meeting/redux/RTKQuery/Example'

const UserList = () => {
  // header menu context
  const { setHeaderMenu } = useContext(RenderHeaderMenu)
  const [modal, toggleModal] = useModal()

  const handleClick = () => {
    toggleModal()
  }

  // create a menu on header
  useEffect(() => {
    setHeaderMenu(
      <>
        <NavItem className=''>
          <BsTooltip title={FM('create-user')}>
            <NavLink className='' onClick={toggleModal}>
              <UserPlus className={'ficon ' + (modal ? 'text-primary' : '')} />
            </NavLink>
          </BsTooltip>
        </NavItem>
      </>
    )
    return () => {
      setHeaderMenu(null)
    }
  }, [modal])

  return (
    <div onClick={handleClick}>
      <a href='#'>asdbn saiuydusaiydsai</a>
      <h1>Whereas recognition of the inherent dignity</h1>
      <h2>Whereas recognition of the inherent dignity</h2>
      <h3>Whereas recognition of the inherent dignity</h3>
      <h4>Whereas recognition of the inherent dignity</h4>
      <h5>Whereas recognition of the inherent dignity</h5>
      <h6>Whereas recognition of the inherent dignity</h6>
    </div>
  )
}

export default UserList
