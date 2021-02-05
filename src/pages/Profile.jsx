import React from 'react'

import Container from 'react-bootstrap/Container'
import DoublePane from '../components/common/DoublePane'
import RemoveUser from '../components/forms/user/Delete'
import EditCredentials from '../components/forms/user/EditCredentials'
import EditAccount from '../components/forms/user/EditAccount'

export default function Profile() {
	return (
		<Container className='core'>
			<DoublePane leftPane='2'>
				<EditAccount title='Account information' />
				<EditCredentials title='Credentials' />
				<RemoveUser title='Delete account' />
			</DoublePane>
		</Container>
	)
}
