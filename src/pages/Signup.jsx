import React from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Create from '../components/forms/user/Create'

export default function Signup() {
	return (
		<Container className='core'>
			<Card>
				<Card.Body>
					<Create title='Sign up' />
				</Card.Body>
			</Card>
		</Container>
	)
}
