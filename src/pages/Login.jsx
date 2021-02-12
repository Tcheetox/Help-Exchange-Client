import React, { useEffect, useContext } from 'react'

import { AppContext } from '../AppContext'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Connect from '../components/forms/user/Connect'

export default function Login({ match }) {
	const { fetchRequest, triggerBanner } = useContext(AppContext)

	// Trigger account activation (email callback)
	useEffect(
		() =>
			match.params &&
			'token' in match.params &&
			fetchRequest(
				'PUT',
				{ confirmation_token: match.params.token },
				'users/confirm_account',
				r => r.status === 204 && triggerBanner('account_verified'),
				false
			),
		[match, fetchRequest]
	)

	return (
		<Container className='core'>
			<h1>Log in</h1>
			<Card>
				<Card.Body>
					<Connect />
				</Card.Body>
			</Card>
		</Container>
	)
}
