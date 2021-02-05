import React from 'react'

import Container from 'react-bootstrap/Container'
import DoublePane from '../components/common/DoublePane'
import Overview from '../components/dashboard/Overview'
import CreateRequest from '../components/forms/CreateRequest'
import Awards from '../components/dashboard/Awards'

export default function Dashboard() {
	return (
		<Container className='core'>
			<DoublePane leftPane='2'>
				<Overview title='Requests overview' />
				<CreateRequest title='Create request' />
				<Awards title='Awards' />
			</DoublePane>
		</Container>
	)
}
