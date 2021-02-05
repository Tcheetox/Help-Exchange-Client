import React from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Connect from '../components/forms/user/Connect'

export default function Login() {
	return (
		<Container className='core'>
			<Card>
				<Card.Body>
					<Connect title='Log in' />
				</Card.Body>
			</Card>
		</Container>
	)
}
