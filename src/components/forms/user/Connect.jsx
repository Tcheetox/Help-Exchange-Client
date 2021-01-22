import React, { useState, useContext } from 'react'
import { shouldShowInvalid, shouldShowValid, isBlank } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import LoadingButton from '../../decorations/LoadingButton'

export default function Connect({ title = '' }) {
	const { logIn } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({
		email: '',
		password: '',
		rememberMe: true,
	})
	const [errors, setErrors] = useState({
		email: undefined,
		password: undefined,
	})

	const handleChange = e => {
		if (e.currentTarget.type === 'checkbox') setData({ ...data, [e.target.name]: e.target.checked })
		else {
			setData({ ...data, [e.target.name]: e.target.value })
			setErrors({ ...errors, [e.target.name]: undefined })
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		// Check empty fields
		const rej = 'Rejected'
		const errorsAssessed = {
			email: isBlank(data.email) ? rej : '',
			password: isBlank(data.password) ? rej : '',
		}
		setErrors(errorsAssessed)
		// Attempt to login
		if (Object.values(errorsAssessed).filter(x => x === '').length === Object.keys(errors).length) {
			setDisplay(1)
			logIn(data.email, data.password, data.rememberMe, (r, pR) => {
				if (r.status === 200) setDisplay(2)
				else {
					if (r.status === 500) setErrors({ email: undefined, password: undefined })
					else setErrors({ email: rej, password: rej })
					setDisplay(0)
				}
			})
		}
	}

	return (
		<Form onSubmit={handleSubmit} validated={false}>
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
			</Form.Group>

			<Form.Group>
				<Form.Check
					type='checkbox'
					id='formConditions'
					name='rememberMe'
					checked={data.rememberMe}
					onChange={handleChange}
					label='Remember me'
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
