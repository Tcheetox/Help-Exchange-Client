import React, { useState, useEffect, useContext, useCallback } from 'react'

import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import LoadingButton from '../../decorations/LoadingButton'
import FileUpload from '../../decorations/FileUpload'

// TODO: disabled state for FileUpload + success + error?!

export default function EditAccount() {
	const { fetchRequest, fetchFileRequest, isUserLoggedIn } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		address: '',
		postCode: '',
		country: '',
		govId: '',
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
				govId: pR.gov_id,
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
				gov_id: data.govId,
			},
			'users/edit',
			(r, pR) => {
				refreshData(r, pR)
				if (r.status === 200) setDisplay(2)
				else setDisplay(0)
			}
		)
	}

	useEffect(() => {
		if (isUserLoggedIn) fetchRequest('GET', null, 'users/edit', (r, pR) => refreshData(r, pR))
	}, [fetchRequest, isUserLoggedIn])

	const handleFileChange = useCallback(
		(file, callback = null) =>
			file
				? fetchFileRequest('PATCH', 'government_id', file, 'users/edit', (r, pR) => {
						if (callback) callback(r, pR)
						if (r.status === 200)
							setData(d => {
								return { ...d, govId: pR.gov_id }
							})
				  })
				: setData(d => {
						return { ...d, govId: null }
				  }),
		[fetchFileRequest]
	)

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
						isValid={display === 2}
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
						isValid={display === 2}
						disabled={display === 1 || display === 2}
					/>
				</Form.Group>
			</Form.Row>
			<Form.Group>
				<FileUpload
					allowedExtensions={['.jpg', '.jpeg', '.png', '.pdf']}
					maxSize={3145728}
					defaultUrl={data.govId}
					onChange={handleFileChange}
					disabled={display === 1 || display === 2}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Phone</Form.Label>
				<Form.Control
					type='tel'
					name='phone'
					placeholder='Phone'
					value={data.phone}
					onChange={handleChange}
					isValid={display === 2}
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
					isValid={display === 2}
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
						isValid={display === 2}
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
						isValid={display === 2}
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
