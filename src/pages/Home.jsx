import React from 'react'

import Container from 'react-bootstrap/Container'
import Counter from '../components/Counter'

export default function Home() {
	return (
		<>
			<Counter />
			<Container className='core'>
				<h1>Home</h1>
			</Container>
		</>
	)
}
