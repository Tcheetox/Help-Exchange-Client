import React, { useState, useEffect, useContext, useCallback } from 'react'

import { AppContext } from '../../../AppContext'
import Form from 'react-bootstrap/Form'
import { LoadingButton, InputForm, FileForm } from '../../common/'
import { geocode } from '../../../utilities'

export default function EditAccount() {
	const {
		fetchRequest,
		fetchFileRequest,
		userLoggedIn,
		userProfile,
		updateUserProfile,
		triggerBanner,
	} = useContext(AppContext)

	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		address: '',
		lat: null,
		lng: null,
		postCode: '',
		country: '',
		govId: '',
	})

	const handleChange = e => setData({ ...data, [e.target.name]: e.target.value })
	const handleSubmit = e => {
		e.preventDefault()
		setDisplay(1)
		geocode(`${data.address}, ${data.postCode}, ${data.country}`, ({ lat, lng }) =>
			fetchRequest(
				'PUT',
				{
					first_name: data.firstName,
					last_name: data.lastName,
					phone: data.phone,
					address: data.address,
					lat: lat,
					lng: lng,
					post_code: data.postCode,
					country: data.country,
					gov_id: data.govId,
				},
				'users',
				(r, pR) => {
					if (r.status === 200) {
						setDisplay(2)
						triggerBanner('profile_updated')
						updateUserProfile(pR)
					} else setDisplay(0)
				}
			)
		)
	}

	// Update local state with AppContext userProfile
	useEffect(() => {
		userLoggedIn &&
			userProfile &&
			setData({
				firstName: userProfile.first_name ? userProfile.first_name : '',
				lastName: userProfile.last_name ? userProfile.last_name : '',
				phone: userProfile.phone ? userProfile.phone : '',
				address: userProfile.address ? userProfile.address : '',
				lat: userProfile.lat,
				lng: userProfile.lng,
				postCode: userProfile.post_code ? userProfile.post_code : '',
				country: userProfile.country ? userProfile.country : '',
				govId: userProfile.gov_id ? userProfile.gov_id : '',
			})
	}, [userLoggedIn, userProfile])

	const handleFileChange = useCallback(
		(file, callback = null) => {
			if (file)
				fetchFileRequest('POST', 'government_id', file, 'users/storage', (r, pR) => {
					if (r.status === 201) setData(d => ({ ...d, govId: pR.gov_id }))
					if (callback) callback(r, pR)
				})
			else {
				setData(d => ({ ...d, govId: null }))
				if (callback) callback({ status: 0 }, {})
			}
		},
		[fetchFileRequest]
	)

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Row>
				<InputForm
					label='First name'
					name='firstName'
					placeholder='First name'
					value={data.firstName}
					onChange={handleChange}
					display={display}
					canBeInvalid={false}
				/>
				<InputForm
					label='Last name'
					name='lastName'
					placeholder='Last name'
					value={data.lastName}
					onChange={handleChange}
					display={display}
					canBeInvalid={false}
				/>
			</Form.Row>
			<FileForm
				allowedExtensions={['.jpg', '.jpeg', '.png', '.pdf']}
				maxSize={3145728}
				defaultUrl={data.govId}
				onChange={handleFileChange}
				display={display}
				label='Government ID'
				text='An official proof of identity is required to use our services'
			/>
			<InputForm
				label='Phone'
				name='phone'
				placeholder='Phone'
				value={data.phone}
				onChange={handleChange}
				display={display}
				canBeInvalid={false}
			/>
			<InputForm
				label='Address'
				name='address'
				placeholder='Address'
				value={data.address}
				onChange={handleChange}
				display={display}
				canBeInvalid={false}
			/>
			<Form.Row>
				<InputForm
					label='Post code'
					name='postCode'
					placeholder='Post code'
					value={data.postCode}
					onChange={handleChange}
					display={display}
					canBeInvalid={false}
				/>
				<InputForm
					label='Country'
					name='country'
					placeholder='Country'
					value={data.country}
					onChange={handleChange}
					display={display}
					canBeInvalid={false}
				/>
			</Form.Row>
			<LoadingButton variant='primary' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
