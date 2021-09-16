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
					{(() => {
						switch (match.params.action.toLowerCase()) {
							case 'password':
								return 'Forgot password'
							case 'confirmation':
								return 'Resend confirmation'
							default:
								return 'Reset password'
						}
					})()}
				</h1>
				<Card>
					<Card.Body>
						{(() => {
							switch (match.params.action.toLowerCase()) {
								case 'password':
									return <EmailOnly action='forgot_password' />
								case 'confirmation':
									return <EmailOnly action='send_confirmation' />
								default:
									return <EditCredentials reset={true} token={match.params.token} />
							}
						})()}
						{match.params.action.toLowerCase() === 'password' || match.params.action.toLowerCase() === 'confirmation' ? (
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
