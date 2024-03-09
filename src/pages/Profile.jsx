import React from 'react'

import Container from 'react-bootstrap/Container'
import { DoublePane } from '../components/common/'
import RemoveUser from '../components/forms/user/Delete'
import EditCredentials from '../components/forms/user/EditCredentials'
import EditAccount from '../components/forms/user/EditAccount'

export default function Profile({ match }) {
  const activePane = () => {
    switch (match.params && 'section' in match.params ? match.params.section.toLowerCase() : '') {
      case 'credentials':
        return 1
      case 'delete':
        return 2
      case 'information':
      default:
        return 0
    }
  }

  return (
    <Container className='profile core'>
      <h1>Profile</h1>
      <DoublePane leftPane='2' defaultActivePane={activePane()}>
        <EditAccount title='Account information' />
        <EditCredentials title='Credentials' />
        <RemoveUser title='Delete account' />
      </DoublePane>
    </Container>
  )
}
