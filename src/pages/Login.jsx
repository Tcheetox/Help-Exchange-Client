import React from 'react'
import Card from 'react-bootstrap/Card'

import Connect from '../components/forms/user/Connect'

export default function Login() {
	return (
		<Card>
			<Card.Body>
				<Connect title='Log in' />
			</Card.Body>
		</Card>
	)
}
