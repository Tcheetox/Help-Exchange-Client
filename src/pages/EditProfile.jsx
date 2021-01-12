import React from 'react'

import DoublePane from '../components/decorations/DoublePane'
import RemoveUser from '../components/forms/RemoveUser'

export default function EditProfile() {
	return (
		<DoublePane leftPane='2'>
			<RemoveUser title='Delete account' />
			<RemoveUser title='Delete account' />
		</DoublePane>
	)
}
