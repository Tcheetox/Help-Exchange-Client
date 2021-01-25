import React from 'react'

import DoublePane from '../components/decorations/DoublePane'

import Overview from '../components/Overview'
import CreateRequest from '../components/forms/CreateRequest'
import Awards from '../components/Awards'

export default function Dashboard() {
	return (
		<DoublePane leftPane='2'>
			<Overview title='Requests overview' />
			<CreateRequest title='Create request' />
			<Awards title='Awards' />
		</DoublePane>
	)
}
