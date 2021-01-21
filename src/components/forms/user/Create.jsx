import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { isValidEmail, isBlank, shouldShowValid, shouldShowInvalid } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import LoadingButton from '../../decorations/LoadingButton'

export default function Create({ title = '' }) {
	const { fetchRequest, logIn } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({
		email: '',
		password: '',
		passwordConfirmation: '',
		conditions: false,
	})
	const [errors, setErrors] = useState({
		email: undefined,
		password: undefined,
		passwordConfirmation: undefined,
		conditions: undefined,
	})

	const handleChange = e => {
		if (e.currentTarget.type === 'checkbox') setData({ ...data, [e.target.name]: e.target.checked })
		else setData({ ...data, [e.target.name]: e.target.value })
		setErrors({ ...errors, [e.target.name]: undefined })
	}

	const handleSubmit = e => {
		e.preventDefault()
		// Check validity
		const errorsAssessed = { ...errors }
		Object.keys(errorsAssessed).forEach(k => (errorsAssessed[k] = ''))
		if (!isValidEmail(data.email)) errorsAssessed.email = 'You must provide a valid email address'
		if (isBlank(data.password) || data.password.length < 6)
			errorsAssessed.password = 'Password must contain at least 6 characters'
		if (isBlank(data.passwordConfirmation.length))
			errorsAssessed.passwordConfirmation = 'Confirmation password cannot be left empty'
		else if (data.password !== data.passwordConfirmation)
			errorsAssessed.passwordConfirmation = "Confirmation password doesn't match"
		if (data.conditions !== true) errorsAssessed.conditions = 'Unchecked'
		setErrors(errorsAssessed)

		// Submit form if no errors
		if (Object.values(errorsAssessed).filter(x => x === '').length === Object.keys(errors).length) {
			setDisplay(1)
			fetchRequest(
				'POST',
				{ email: data.email, password: data.password },
				'users',
				(r, pR) => {
					if ('user' in pR && pR.user.access_token !== '') {
						logIn(data.email, data.password, true)
						setDisplay(2)
					} else {
						// Check if the error is due to existing email, adjust data validation
						if ('error' in pR && pR.error.server_code === 42201)
							setErrors({ ...errors, email: 'Email already in use' })
						// Reset data validation
						else
							setErrors({
								email: undefined,
								password: undefined,
								passwordConfirmation: undefined,
								conditions: undefined,
							})
						setDisplay(0)
					}
				},
				false // Don't use token because you don't have one (yet)
			)
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<h2>{title}</h2>
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control
					type='email'
					name='email'
					placeholder='Enter email'
					value={data.email}
					onChange={handleChange}
					isInvalid={shouldShowInvalid(errors.email)}
					isValid={shouldShowValid(errors.email, display)}
					disabled={display === 1 || display === 2}
				/>
				<Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
			</Form.Group>
			<Form.Group>
				<Form.Label>Password</Form.Label>
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
				<Form.Label>Confirm password</Form.Label>
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

			<Form.Group>
				<Form.Check
					type='checkbox'
					id='formConditions'
					name='conditions'
					checked={data.conditions}
					onChange={handleChange}
					isInvalid={shouldShowInvalid(errors.conditions)}
					isValid={shouldShowValid(errors.conditions, display)}
					label={
						<>
							By signing up to Fish For Help, you agree to the <Link to='/'>Terms of Service</Link>. View our{' '}
							<Link to='/'>Privacy Policy</Link>.
						</>
					}
					disabled={display === 1 || display === 2}
					custom
				/>
			</Form.Group>
			<LoadingButton variant='primary' type='submit' display={display}>
				Register
			</LoadingButton>
		</Form>
	)
}
