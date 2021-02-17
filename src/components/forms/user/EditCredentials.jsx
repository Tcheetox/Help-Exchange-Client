import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { isBlank } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import { LoadingButton, InputForm } from '../../common/'

export default function EditCredentials({ reset = false, token }) {
	const { fetchRequest, triggerBanner } = useContext(AppContext)
	const history = useHistory()
	const [redirect, setRedirect] = useState(false)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({ currentPassword: '', password: '', passwordConfirmation: '' })
	const [errors, setErrors] = useState({
		currentPassword: undefined,
		password: undefined,
		passwordConfirmation: undefined,
	})

	const handleResponse = (r, pR) => {
		if (r.status === 403 && 'error' in pR) {
			setErrors({
				...errors,
				password: pR.error.server_code === 40300 ? pR.error.description : errors.password,
				currentPassword: pR.error.server_code === 40302 ? pR.error.description : errors.currentPassword,
			})
			setDisplay(0)
		} else {
			triggerBanner('changed_credentials')
			setDisplay(2)
			if (reset) setRedirect(true)
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		// Data validation
		const errorsAssessed = { ...errors }
		Object.keys(errorsAssessed).forEach(k => (errorsAssessed[k] = ''))
		if (isBlank(data.password) || data.password.length < 6)
			errorsAssessed.password = 'A valid password must contain at least 6 characters'
		if (!reset && isBlank(data.currentPassword))
			errorsAssessed.currentPassword = 'Current password cannot be left empty'
		if (isBlank(data.passwordConfirmation))
			errorsAssessed.passwordConfirmation = 'Confirmation password cannot be left empty'
		else if (data.password !== data.passwordConfirmation)
			errorsAssessed.passwordConfirmation = "Confirmation password doesn't match"
		setErrors(errorsAssessed)

		// Submit form if no errors
		if (
			Object.values(errorsAssessed).filter(
				x => x === '' && (!reset || (reset && x.name !== 'currentPassword'))
			).length === Object.keys(errors).length
		) {
			setDisplay(1)
			if (reset)
				fetchRequest(
					'PUT',
					{ password: data.password, reset_password_token: token },
					`users/forgotten_password`,
					(r, pR) => handleResponse(r, pR),
					false
				)
			else
				fetchRequest(
					'PUT',
					{ current_password: data.currentPassword, password: data.password },
					'users',
					(r, pR) => handleResponse(r, pR)
				)
		}
	}

	const handleChange = e => {
		setData({ ...data, [e.target.name]: e.target.value })
		setErrors({ ...errors, [e.target.name]: undefined })
	}

	// Handle automatic redirect in case of password reset
	useEffect(() => {
		let timer
		if (redirect) timer = setTimeout(() => history.push('/'), 1500)
		return () => clearTimeout(timer)
	}, [redirect, history])

	return (
		<Form onSubmit={handleSubmit}>
			{!reset ? (
				<>
					<InputForm
						label='Current password'
						type='password'
						name='currentPassword'
						placeholder='Password'
						value={data.currentPassword}
						error={errors.currentPassword}
						onChange={handleChange}
						text='Your current password is mandatory to validate the change'
						display={display}
					/>
					<hr />
				</>
			) : null}
			<InputForm
				label='New password'
				type='password'
				name='password'
				placeholder='New password'
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
				placeholder='New password'
				value={data.passwordConfirmation}
				error={errors.passwordConfirmation}
				onChange={handleChange}
				display={display}
			/>
			<LoadingButton className='plain-blue' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
