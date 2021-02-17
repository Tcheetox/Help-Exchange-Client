import React, { useState, useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { isBlank } from '../../../utilities'
import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import { LoadingButton, InputForm } from '../../common/'

export default function Connect({ modalShow = null }) {
	const { logIn } = useContext(AppContext)
	const history = useHistory()
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
	const [redirect, setRedirect] = useState(false)

	// Automatic redirection after successful login
	useEffect(() => {
		let timer
		if (redirect) timer = setTimeout(() => history.push('/'), 1500)
		return () => clearTimeout(timer)
	}, [redirect, history])

	// Prevent modifying state on unmounted component
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
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
					if (r.status === 200) {
						setDisplay(2)
						if (modalShow) modalShow(false)
						else setRedirect(true)
					} else {
						if (r.status === 500) setErrors({ email: undefined, password: undefined })
						else setErrors({ email: rej, password: rej })
						setDisplay(0)
					}
				}
			})
		}
	}

	return (
		<div className='connect'>
			<Form onSubmit={handleSubmit} validated={false}>
				<InputForm
					label='Email'
					name='email'
					error={errors.email}
					placeholder='Username'
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
				<LoadingButton className='fancy-blue' type='submit' display={display}>
					Connect
				</LoadingButton>
			</Form>
			<hr />
			<div className='links'>
				<div>
					Don't have an account yet?{' '}
					<Link to='/users/signup' onClick={() => (modalShow ? modalShow(false) : null)}>
						Sign up
					</Link>
				</div>
				<Link to='/users/troubleshoot/password' onClick={() => (modalShow ? modalShow(false) : null)}>
					Forgot your password?
				</Link>
			</div>
		</div>
	)
}
