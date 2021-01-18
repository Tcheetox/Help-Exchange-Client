import React from 'react'

import DoublePane from '../components/decorations/DoublePane'
import RemoveUser from '../components/forms/RemoveUser'
import EditCredentials from '../components/forms/EditCredentials'
import EditAccount from '../components/forms/EditAccount'

export default function EditProfile() {
	return (
		<DoublePane leftPane='2'>
			<EditAccount title='Account information' />
			<EditCredentials title='Credentials' />
			<RemoveUser title='Delete account' />
		</DoublePane>
	)
}
