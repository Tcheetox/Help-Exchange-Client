import React from 'react'

import Card from 'react-bootstrap/Card'

import CreateUser from '../components/forms/CreateUser'

export default function Signup() {
	return (
		<Card>
			<Card.Body>
				<CreateUser title='Sign up' />
			</Card.Body>
		</Card>
	)
}
