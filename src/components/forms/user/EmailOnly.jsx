import React, { useState, useContext } from 'react'

import { AppContext } from '../../../AppContext'
import { isValidEmail, isBlank } from '../../../utilities'
import Form from 'react-bootstrap/Form'
import { LoadingButton, InputForm } from '../../common'

export default function EmailOnly({ action }) {
	const { fetchRequest, triggerBanner } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState('')
	const [error, setError] = useState(undefined)

	const handleSubmit = e => {
		e.preventDefault()
		if (isBlank(data) || !isValidEmail(data)) setError('You must provide a valid email address')
		else {
			setDisplay(1)
			fetchRequest(
				'POST',
				{ email: data },
				`users/mailer/${action}`,
				(r, pR) => {
					if (r.status === 201) {
						triggerBanner(action)
						setDisplay(2)
					} else {
						if ('error' in pR && pR.error.server_code === 40004) setError("This email doesn't exist")
						setDisplay(0)
					}
				},
				false
			)
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<InputForm
				label='Email address'
				name='email'
				placeholder='Email'
				value={data}
				error={error}
				display={display}
				onChange={e => {
					setData(e.target.value)
					setError(undefined)
				}}
			/>
			<LoadingButton className='fancy-blue' type='submit' display={display}>
				Send
			</LoadingButton>
		</Form>
	)
}
