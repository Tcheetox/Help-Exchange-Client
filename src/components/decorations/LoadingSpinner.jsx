import React from 'react'

import Spinner from 'react-bootstrap/Spinner'

export default function LoadingSpinner({ overlay = false }) {
	return (
		<div className={`spinner-wrapper ${overlay ? 'overlay' : ''}`}>
			<Spinner animation='border' />
		</div>
	)
}
