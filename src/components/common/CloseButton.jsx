import React from 'react'

import CloseIcon from '@material-ui/icons/Close'

export default function CloseButton({ onClick }) {
	const handleClick = e => {
		e.stopPropagation()
		onClick()
	}

	return (
		<div className='close' onClick={handleClick}>
			<CloseIcon />
		</div>
	)
}
