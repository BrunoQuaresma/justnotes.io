import React, { useCallback } from 'react'
import ReactGA from 'react-ga'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { history } from 'components/App'
import { logout } from 'auth'
import EncryptButton from 'components/EncryptButton'
import { removeRememberCryptoSecret } from 'crypt'
import { useDispatch } from 'react-redux'
import { unsetCryptoSecret } from 'stores/boardStore'

const BoardHeader: React.FC = () => {
  const dispatch = useDispatch()

  const handleLogout = useCallback(() => {
    logout()
    removeRememberCryptoSecret()
    dispatch(unsetCryptoSecret())

    ReactGA.event({
      category: 'User',
      action: 'Logout'
    })
    history.navigate('/')
  }, [dispatch])

  return (
    <div className="row px-3 py-1 mb-3 justify-content-end align-items-center">
      <EncryptButton></EncryptButton>

      <UncontrolledDropdown className="ml-1">
        <DropdownToggle outline color="secondary" size="sm" caret>
          My account
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  )
}

export default BoardHeader
