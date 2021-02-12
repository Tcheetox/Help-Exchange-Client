import React, { useContext } from 'react'

import { AppData } from '../AppData'
import Card from 'react-bootstrap/Card'

export default function Counter() {
	const { helpRequests } = useContext(AppData)
	return (
		<Card className='counter'>
			<Card.Body>
				<Card.Title>We need your help!</Card.Title>
				<Card.Text>{helpRequests.length} requests pending</Card.Text>
			</Card.Body>
		</Card>
	)
}
