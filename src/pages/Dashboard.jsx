import React from 'react'

import Container from 'react-bootstrap/Container'
import { DoublePane } from '../components/common/'
import Overview from '../components/dashboard/Overview'
import CreateRequest from '../components/forms/CreateRequest'

export default function Dashboard({ match }) {
	const activePane = () => {
		switch (match.params && 'section' in match.params ? match.params.section.toLowerCase() : '') {
			case 'create':
				return 1
			case 'overview':
			default:
				return 0
		}
	}

	return (
		<Container className='dashboard core'>
			<h1>Dashboard</h1>
			<DoublePane leftPane='2' defaultActivePane={activePane()}>
				<Overview title='Overview' showRequest={match.params && 'section' in match.params && 'id' in match.params ? match.params.id : -1} />
				<CreateRequest title='Create request' />
			</DoublePane>
		</Container>
	)
}
