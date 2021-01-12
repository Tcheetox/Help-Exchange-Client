import React from 'react'
import Card from 'react-bootstrap/Card'

import ConnectUser from '../components/forms/ConnectUser'

export default function Login() {
	return (
		<Card>
			<Card.Body>
				<ConnectUser title='Log in' />
			</Card.Body>
		</Card>
	)
}
