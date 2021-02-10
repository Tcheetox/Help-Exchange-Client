import React, { useState, useContext } from 'react'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import { LoadingButton, InputForm } from '../../common/'

export default function RemoveUser() {
	const { fetchRequest, logOut } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [confirmation, setConfirmation] = useState(false)
	const [confirmationError, setConfirmationError] = useState()

	const handleSubmit = e => {
		e.preventDefault()
		// Check validity
		if (!confirmation) setConfirmationError('Unchecked')
		else {
			setConfirmationError('')
			setDisplay(1)
			fetchRequest('DELETE', null, 'users/edit', (r, pR) => {
				if (r.status === 204) {
					logOut()
					setDisplay(2)
				} else setDisplay(0)
			})
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<InputForm
				type='checkbox'
				name='condition'
				value={confirmation}
				onChange={() => {
					setConfirmation(!confirmation)
					setConfirmationError(undefined)
				}}
				error={confirmationError}
				display={display}
				text='I am sure I want to delete my account'
			/>
			<LoadingButton variant='primary' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
