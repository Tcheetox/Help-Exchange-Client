import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { isValidEmail, isBlank } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import { LoadingButton, InputForm } from '../../common/'

export default function Create({ modalShow = null }) {
	const { fetchRequest, triggerBanner } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({
		email: '',
		password: '',
		passwordConfirmation: '',
		condition: false,
	})
	const [errors, setErrors] = useState({
		email: undefined,
		password: undefined,
		passwordConfirmation: undefined,
		condition: undefined,
	})

	const handleChange = e => {
		if (e.target.type === 'checkbox') setData({ ...data, [e.target.name]: e.target.checked })
		else setData({ ...data, [e.target.name]: e.target.value })
		setErrors({ ...errors, [e.target.name]: undefined })
	}

	const handleSubmit = e => {
		e.preventDefault()
		// Check validity
		const errorsAssessed = { ...errors }
		Object.keys(errorsAssessed).forEach(k => (errorsAssessed[k] = ''))
		if (!isValidEmail(data.email)) errorsAssessed.email = 'You must provide a valid email address'
		if (isBlank(data.password) || data.password.length < 6) errorsAssessed.password = 'Password must contain at least 6 characters'
		if (isBlank(data.passwordConfirmation.length)) errorsAssessed.passwordConfirmation = 'Confirmation password cannot be left empty'
		else if (data.password !== data.passwordConfirmation) errorsAssessed.passwordConfirmation = "Confirmation password doesn't match"
		if (data.condition !== true) errorsAssessed.condition = 'Unchecked'
		setErrors(errorsAssessed)

		// Submit form if no errors
		if (Object.values(errorsAssessed).filter(x => x === '').length === Object.keys(errors).length) {
			setDisplay(1)
			fetchRequest(
				'POST',
				{ email: data.email, password: data.password },
				'users',
				(r, pR) => {
					if (r.status === 201) {
						triggerBanner('send_confirmation')
						setDisplay(2)
						if (modalShow) modalShow(false)
						// Check if the error is due to existing email, adjust data validation
					} else if ('error' in pR && pR.error.server_code === 42201) setErrors({ ...errors, email: 'Email already in use' })
					// Reset data validation
					else
						setErrors({
							email: undefined,
							password: undefined,
							passwordConfirmation: undefined,
							condition: undefined,
						})
					setDisplay(0)
				},
				false // Don't use token because you don't have one (yet)
			)
		}
	}

	return (
		<div className='create'>
			<Form onSubmit={handleSubmit}>
				<InputForm
					label='Email'
					name='email'
					placeholder='Username'
					value={data.email}
					onChange={handleChange}
					error={errors.email}
					display={display}
					text="We'll never share you email address"
				/>
				<InputForm
					label='Password'
					type='password'
					name='password'
					placeholder='Password'
					value={data.password}
					onChange={handleChange}
					error={errors.password}
					display={display}
					text='Choose a strong password with 6 characters minimum'
				/>
				<InputForm
					label='Confirm password'
					type='password'
					name='passwordConfirmation'
					placeholder='Password'
					value={data.passwordConfirmation}
					onChange={handleChange}
					error={errors.passwordConfirmation}
					display={display}
				/>
				<InputForm
					type='checkbox'
					name='condition'
					value={data.condition}
					onChange={handleChange}
					error={errors.condition}
					display={display}
					text={
						<div className='create-conditions'>
							By signing up to Fish For Help, you agree to the{' '}
							<Link to='/' onClick={() => (modalShow ? modalShow(false) : null)}>
								Terms of Service
							</Link>
							. View our{' '}
							<Link to='/' onClick={() => (modalShow ? modalShow(false) : null)}>
								Privacy Policy
							</Link>
							.
						</div>
					}
				/>
				<LoadingButton className='plain-blue' type='submit' display={display}>
					Register
				</LoadingButton>
			</Form>
			<hr />
			<div className='links'>
				<div>
					Didn't get a confirmation link?{' '}
					<Link to='/users/troubleshoot/confirmation' onClick={() => (modalShow ? modalShow(false) : null)}>
						Send again
					</Link>
					.
				</div>
			</div>
		</div>
	)
}
