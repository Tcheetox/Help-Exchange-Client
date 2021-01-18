import React, { useState, useEffect, useContext } from 'react'

import { AppContext } from '../../AppContext'
import Form from 'react-bootstrap/Form'
import LoadingButton from '../decorations/LoadingButton'

export default function EditAccount() {
	const { fetchRequest, userToken } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		address: '',
		postCode: '',
		country: '',
	})

	const refreshData = (r, pR) => {
		if (r.status === 200) {
			setData({
				firstName: pR.first_name,
				lastName: pR.last_name,
				phone: pR.phone,
				address: pR.address,
				postCode: pR.post_code,
				country: pR.country,
			})
		}
	}
	const handleChange = e => setData({ ...data, [e.target.name]: e.target.value })
	const handleSubmit = e => {
		e.preventDefault()
		setDisplay(1)
		fetchRequest(
			'PUT',
			{
				first_name: data.firstName,
				last_name: data.lastName,
				phone: data.phone,
				address: data.address,
				post_code: data.postCode,
				country: data.country,
			},
			'users/edit',
			userToken,
			(r, pR) => {
				refreshData(r, pR)
				setDisplay(0)
			}
		)
	}
	useEffect(() => fetchRequest('GET', null, 'users/edit', userToken, (r, pR) => refreshData(r, pR)), [
		userToken,
		fetchRequest,
	])

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Row>
				<Form.Group>
					<Form.Label>First name</Form.Label>
					<Form.Control
						type='text'
						name='firstName'
						placeholder='First name'
						value={data.firstName}
						onChange={handleChange}
						disabled={display === 1 || display === 2}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Last name</Form.Label>
					<Form.Control
						type='text'
						name='lastName'
						placeholder='Last name'
						value={data.lastName}
						onChange={handleChange}
						disabled={display === 1 || display === 2}
					/>
				</Form.Group>
			</Form.Row>
			<Form.Group>
				<Form.Label>Phone</Form.Label>
				<Form.Control
					type='tel'
					name='phone'
					placeholder='Phone'
					value={data.phone}
					onChange={handleChange}
					disabled={display === 1 || display === 2}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Address</Form.Label>
				<Form.Control
					type='text'
					name='address'
					placeholder='Address'
					value={data.address}
					onChange={handleChange}
					disabled={display === 1 || display === 2}
				/>
			</Form.Group>
			<Form.Row>
				<Form.Group>
					<Form.Label>Post code</Form.Label>
					<Form.Control
						type='text'
						name='postCode'
						placeholder='Post code'
						value={data.postCode}
						onChange={handleChange}
						disabled={display === 1 || display === 2}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Country</Form.Label>
					<Form.Control
						type='text'
						name='country'
						placeholder='Country'
						value={data.country}
						onChange={handleChange}
						disabled={display === 1 || display === 2}
					/>
				</Form.Group>
			</Form.Row>
			<LoadingButton variant='primary' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
