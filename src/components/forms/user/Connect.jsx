import React, { useState, useContext, useEffect } from 'react'
import { isBlank } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import LoadingButton from '../../common/LoadingButton'
import InputForm from '../../common/InputForm'

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

	// Prevent modifying state on unmounted component
	const [mounted, setMounted] = useState(true)
	useEffect(() => {
		return () => setMounted(false)
	}, [])

	const handleChange = e => {
		if (e.currentTarget.type === 'checkbox') setData({ ...data, [e.target.name]: e.target.checked })
		else {
			setData({ ...data, [e.target.name]: e.target.value })
			setErrors({ ...errors, [e.target.name]: undefined })
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		// Data validation, simply check for empty fields
		const rej = ' '
		const errorsAssessed = {
			email: isBlank(data.email) ? rej : '',
			password: isBlank(data.password) ? rej : '',
		}
		setErrors(errorsAssessed)
		// Attempt to login
		if (Object.values(errorsAssessed).filter(x => x === '').length === Object.keys(errors).length) {
			setDisplay(1)
			logIn(data.email, data.password, data.rememberMe, (r, pR) => {
				if (mounted) {
					if (r.status === 200) setDisplay(2)
					else {
						if (r.status === 500) setErrors({ email: undefined, password: undefined })
						else setErrors({ email: rej, password: rej })
						setDisplay(0)
					}
				}
			})
		}
	}

	return (
		<Form onSubmit={handleSubmit} validated={false}>
			<h2>{title}</h2>
			<InputForm
				label='Email'
				name='email'
				error={errors.email}
				placeholder='Enter email'
				value={data.email}
				onChange={handleChange}
				display={display}
			/>
			<InputForm
				label='Password'
				type='password'
				name='password'
				error={errors.password}
				placeholder='Password'
				value={data.password}
				onChange={handleChange}
				display={display}
			/>
			<InputForm
				type='checkbox'
				name='rememberMe'
				text='Remember me'
				value={data.rememberMe}
				onChange={handleChange}
				display={display}
				canBeInvalid={false}
			/>
			<LoadingButton variant='primary' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
