import React, { useState, useContext } from 'react'
import { shouldShowValid, shouldShowInvalid } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import LoadingButton from '../../decorations/LoadingButton'

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
			<Form.Group>
				<Form.Check
					type='checkbox'
					id='formConditions'
					name='conditions'
					checked={confirmation}
					onChange={() => {
						setConfirmation(!confirmation)
						setConfirmationError(undefined)
					}}
					isInvalid={shouldShowInvalid(confirmationError)}
					isValid={shouldShowValid(confirmationError, display)}
					label='I am sure I want to delete my account'
					disabled={display === 1 || display === 2}
					custom
				/>
			</Form.Group>
			<LoadingButton variant='primary' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
