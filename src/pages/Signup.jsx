import React from 'react'

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Create from '../components/forms/user/Create'

export default function Signup() {
	return (
		<Container className='signup core'>
			<Container>
				<h1>Sign up</h1>
				<Card>
					<Card.Body>
						<Create />
					</Card.Body>
				</Card>
			</Container>
		</Container>
	)
}
