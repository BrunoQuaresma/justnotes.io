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

const BoardHeader: React.FC = () => {
  const handleLogout = useCallback(() => {
    logout()
    ReactGA.event({
      category: 'User',
      action: 'Logout'
    })
    history.navigate('/')
  }, [])

  return (
    <div className="row px-3 py-1 mb-3">
      <UncontrolledDropdown className="ml-auto">
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
