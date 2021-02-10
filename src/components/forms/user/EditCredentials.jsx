import React, { useState, useContext } from 'react'
import { isBlank } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import { LoadingButton, InputForm } from '../../common/'
import { SuccessCredentialsChanged } from '../../bannerMessages'

export default function EditCredentials() {
	const { fetchRequest, toggleBanner } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({ currentPassword: '', password: '', passwordConfirmation: '' })
	const [errors, setErrors] = useState({
		currentPassword: undefined,
		password: undefined,
		passwordConfirmation: undefined,
	})

	const handleSubmit = e => {
		e.preventDefault()
		// Data validation
		const errorsAssessed = { ...errors }
		Object.keys(errorsAssessed).forEach(k => (errorsAssessed[k] = ''))
		if (isBlank(data.password) || data.password.length < 6)
			errorsAssessed.password = 'A valid password must contain at least 6 characters'
		if (isBlank(data.currentPassword))
			errorsAssessed.currentPassword = 'Current password cannot be left empty'
		if (isBlank(data.passwordConfirmation))
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
					if (r.status === 204) {
						setDisplay(2)
						toggleBanner(SuccessCredentialsChanged())
					} else {
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

	const handleChange = e => {
		setData({ ...data, [e.target.name]: e.target.value })
		setErrors({ ...errors, [e.target.name]: undefined })
	}

	return (
		<Form onSubmit={handleSubmit}>
			<InputForm
				label='Current password'
				type='password'
				name='currentPassword'
				placeholder='Current password'
				value={data.currentPassword}
				error={errors.currentPassword}
				onChange={handleChange}
				text='Your current password is mandatory to validate the change'
				display={display}
			/>
			<hr />
			<InputForm
				label='New password'
				type='password'
				name='password'
				placeholder='Password'
				value={data.password}
				error={errors.password}
				onChange={handleChange}
				text='Choose a strong password with 6 characters minimum'
				display={display}
			/>
			<InputForm
				label='Confirm new password'
				type='password'
				name='passwordConfirmation'
				placeholder='Password'
				value={data.passwordConfirmation}
				error={errors.passwordConfirmation}
				onChange={handleChange}
				display={display}
			/>
			<LoadingButton variant='primary' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
