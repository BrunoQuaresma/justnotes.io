import React, { useCallback } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import ReactGA from 'react-ga'

const filenames = {
  lin: 'justnotes.io-linux-x64.zip',
  mac: 'justnotes.io-darwin-x64.zip',
  win: 'justnotes.io-win32-x64.zip'
}

const SignInPage: React.FC = () => {
  const handleDownloadClick = useCallback(
    (version: 'lin' | 'mac' | 'win') => () => {
      ReactGA.event({
        category: 'Download',
        action: version
      })

      window.location.href = `/downloads/${filenames[version]}`
    },
    []
  )

  return (
    <div className="row py-3 py-lg-5">
      <div className="col">
        <span className="lead">
          <span className="font-weight-bold">justnotes</span>
          <span className="text-muted">.io</span>
        </span>
      </div>

      <div className="col col-auto ml-auto d-none d-md-block">
        <UncontrolledDropdown>
          <DropdownToggle color="light" caret>
            Downloads
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem header>Versions</DropdownItem>
            <DropdownItem onClick={handleDownloadClick('mac')}>
              Mac
            </DropdownItem>
            <DropdownItem onClick={handleDownloadClick('win')}>
              Windows
            </DropdownItem>
            <DropdownItem onClick={handleDownloadClick('lin')}>
              Linux
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  )
}

export default SignInPage
