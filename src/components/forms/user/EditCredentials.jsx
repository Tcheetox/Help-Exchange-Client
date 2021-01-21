import React, { useState, useContext } from 'react'
import { isBlank, shouldShowValid, shouldShowInvalid } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import LoadingButton from '../../decorations/LoadingButton'

// TODO: verify behavior without server -> adjust banner, etc.
// Next user related forms under specific folder
// Smartly refactor Form.Control <=> Think about data validation beforehand!
// Perhaps TODO: add banner when password has changed!

export default function EditCredentials() {
	const { fetchRequest } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({ currentPassword: '', password: '', passwordConfirmation: '' })
	const [errors, setErrors] = useState({
		currentPassword: undefined,
		password: undefined,
		passwordConfirmation: undefined,
	})

	const handleChange = e => {
		setData({ ...data, [e.target.name]: e.target.value })
		setErrors({ ...errors, [e.target.name]: undefined })
	}
	const handleSubmit = e => {
		e.preventDefault()
		// Check validity
		const errorsAssessed = { ...errors }
		Object.keys(errorsAssessed).forEach(k => (errorsAssessed[k] = ''))
		if (isBlank(data.password) || data.password.length < 6)
			errorsAssessed.password = 'A valid password must contain at least 6 characters'
		if (isBlank(data.currentPassword.length))
			errorsAssessed.currentPassword = 'Current password cannot be left empty'
		if (isBlank(data.passwordConfirmation.length))
			errorsAssessed.passwordConfirmation = 'Confirmation password cannot be left empty'
		else if (data.password !== data.passwordConfirmation)
			errorsAssessed.passwordConfirmation = "Confirmation password doesn't match"
		setErrors(errorsAssessed)

		// Submit form if no errors
		if (Object.values(errorsAssessed).filter(x => x === '').length === Object.keys(errors).length) {
			setDisplay(1)
			fetchRequest(
				'PUT',
				{ current_password: data.currentPassword, password: data.password },
				'users/edit',
				(r, pR) => {
					if (r.status === 204) setDisplay(2)
					else {
						if (r.status === 403 && 'error' in pR) {
							setErrors({
								...errors,
								password: pR.error.server_code === 40301 ? pR.error.description : errors.password,
								currentPassword:
									pR.error.server_code === 40302 ? pR.error.description : errors.currentPassword,
							})
						}
						setDisplay(0)
					}
				}
			)
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group>
				<Form.Label>Current password</Form.Label>
				<Form.Control
					type='password'
					name='currentPassword'
					placeholder='Current password'
					value={data.currentPassword}
					onChange={handleChange}
					isInvalid={shouldShowInvalid(errors.currentPassword)}
					isValid={shouldShowValid(errors.currentPassword, display)}
					disabled={display === 1 || display === 2}
				/>
				<Form.Text
					className={
						shouldShowInvalid(errors.currentPassword)
							? 'invalid'
							: shouldShowValid(errors.currentPassword, display)
							? 'valid'
							: ''
					}>
					{shouldShowInvalid(errors.currentPassword)
						? errors.currentPassword
						: 'Your current password is mandatory to validate the change'}
				</Form.Text>
			</Form.Group>
			<hr />
			<Form.Group>
				<Form.Label>New password</Form.Label>
				<Form.Control
					type='password'
					name='password'
					placeholder='Password'
					value={data.password}
					onChange={handleChange}
					isInvalid={shouldShowInvalid(errors.password)}
					isValid={shouldShowValid(errors.password, display)}
					disabled={display === 1 || display === 2}
				/>
				<Form.Text
					className={
						shouldShowInvalid(errors.password)
							? 'invalid'
							: shouldShowValid(errors.password, display)
							? 'valid'
							: ''
					}>
					{shouldShowInvalid(errors.password)
						? errors.password
						: 'Choose a strong password with 6 characters minimum'}
				</Form.Text>
			</Form.Group>

			<Form.Group>
				<Form.Label>Confirm new password</Form.Label>
				<Form.Control
					type='password'
					name='passwordConfirmation'
					placeholder='Password'
					value={data.passwordConfirmation}
					onChange={handleChange}
					isInvalid={shouldShowInvalid(errors.passwordConfirmation)}
					isValid={shouldShowValid(errors.passwordConfirmation, display)}
					disabled={display === 1 || display === 2}
				/>
				<Form.Control.Feedback type='invalid'>{errors.passwordConfirmation}</Form.Control.Feedback>
			</Form.Group>
			<LoadingButton variant='primary' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
