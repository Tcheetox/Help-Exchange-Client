import React, { useContext } from 'react'

import { AppData } from '../AppData'
import Card from 'react-bootstrap/Card'

export default function Counter() {
	const { helpRequests } = useContext(AppData)
	// TODO: click if not on MAP already
	// TODO: align map settings (right margin) as the counter
	// TODO: position fixed if header has been scrolled out!
	return (
		<Card className='counter'>
			<Card.Body>
				<Card.Title>People await!</Card.Title>
				<Card.Text>
					<span className='bold'>{helpRequests.length}</span> requests pending
				</Card.Text>
			</Card.Body>
		</Card>
	)
}
