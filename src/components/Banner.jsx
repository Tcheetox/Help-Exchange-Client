import React, { useState, useEffect, useContext } from 'react'

import { AppContext } from '../AppContext'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'

export default function Banner() {
	const { bannerMessage, bannerType, bannerTime, bannerTimestamp } = useContext(AppContext)
	const [display, setDisplay] = useState(false)

	useEffect(() => {
		let timeout
		if (bannerMessage) {
			setDisplay(true)
			timeout = setTimeout(() => setDisplay(false), bannerTime)
		}
		return () => clearTimeout(timeout)
	}, [bannerMessage, bannerTime, bannerTimestamp])

	return display ? (
		<Container className='banner'>
			<Alert variant={bannerType} onClose={() => setDisplay(false)} dismissible>
				{bannerMessage}
			</Alert>
		</Container>
	) : null
}
