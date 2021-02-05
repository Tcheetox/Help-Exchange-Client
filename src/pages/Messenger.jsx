import React from 'react'

import Conversation from '../components/chat/Conversation'
import Container from 'react-bootstrap/Container'

// TODO: check login?

export default function Messenger() {
	return (
		<Container className='core'>
			<Conversation />
		</Container>
	)
}
