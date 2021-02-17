import React from 'react'

import EmailOnly from '../components/forms/user/EmailOnly'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import EditCredentials from '../components/forms/user/EditCredentials'

export default function Troubleshoot({ match }) {
	if (match.params && 'action' in match.params)
		return (
			<Container className='troubleshoot core'>
				<h1>
					{match.params.action.toLowerCase() === 'password'
						? 'Forgot password'
						: match.params.action.toLowerCase() === 'confirmation'
						? 'Resend confirmation'
						: 'Reset password'}
				</h1>
				<Card>
					<Card.Body>
						{match.params.action.toLowerCase() === 'password' ? (
							<EmailOnly action='forgot_password' />
						) : match.params.action.toLowerCase() === 'confirmation' ? (
							<EmailOnly action='send_confirmation' />
						) : (
							<EditCredentials reset={true} token={match.params.token} />
						)}
						{match.params.action.toLowerCase() === 'password' ||
						match.params.action.toLowerCase() === 'confirmation' ? (
							<>
								<hr /> Don't worry, we got you covered!
							</>
						) : null}
					</Card.Body>
				</Card>
			</Container>
		)
	else return null
}
