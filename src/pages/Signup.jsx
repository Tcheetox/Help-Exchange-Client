import React from 'react'

import Card from 'react-bootstrap/Card'

import Create from '../components/forms/user/Create'

export default function Signup() {
	return (
		<Card>
			<Card.Body>
				<Create title='Sign up' />
			</Card.Body>
		</Card>
	)
}
