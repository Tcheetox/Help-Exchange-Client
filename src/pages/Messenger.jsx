import React from 'react'

import Conversation from '../components/chat/Conversation'
import Container from 'react-bootstrap/Container'

export default function Messenger({ match }) {
	return (
		<Container className='core messenger'>
			<h1>Messenger</h1>
			<Conversation defaultActivePane={match.params && 'id' in match.params ? parseInt(match.params.id) : 0} />
		</Container>
	)
}
