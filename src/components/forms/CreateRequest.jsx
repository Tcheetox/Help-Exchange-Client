import React, { useState, useEffect, useContext } from 'react'

import { geocode, reverseGeocode, titleize } from '../../utilities'

import Form from 'react-bootstrap/Form'
import InputForm from '../common/InputForm'
import LoadingButton from '../common/LoadingButton'
import Button from 'react-bootstrap/Button'
import ExploreIcon from '@material-ui/icons/Explore'
import { AppContext } from '../../AppContext'
import { AutomaticMessage } from '../bannerMessages'

// TODO: address geocode failure to handle

export default function CreateRequest() {
	const { fetchRequest, isUserLoggedIn, userProfile, toggleBanner } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({
		title: '',
		description: '',
		help_type: 'One-time help',
		address: '',
		lng: null,
		lat: null,
	})
	const [errors, setErrors] = useState({
		title: undefined,
		description: undefined,
		help_type: undefined,
		address: undefined,
	})

	useEffect(
		() =>
			isUserLoggedIn &&
			userProfile &&
			setData(d => {
				return { ...d, address: userProfile.address, lng: userProfile.lng, lat: userProfile.lat }
			}),
		[fetchRequest, isUserLoggedIn, userProfile]
	)

	const onChange = e => {
		if (
			e.target.name !== 'description' ||
			(e.target.name === 'description' && e.target.value.length <= 300)
		) {
			if (e.target.name === 'address') setData({ ...data, address: e.target.value, lat: null, lng: null })
			else setData({ ...data, [e.target.name]: e.target.value })
			setErrors({ ...errors, [e.target.name]: undefined })
		}
	}

	const onSubmit = e => {
		e.preventDefault()
		const _errors = { ...errors }
		Object.keys(_errors).forEach(k =>
			data[k].length > 0 ? (_errors[k] = '') : (_errors[k] = `${titleize(k)} cannot be left empty`)
		)
		setErrors(_errors)
		// Submit form if no errors
		if (
			Object.values(_errors).filter(x => x === '').length === Object.keys(errors).length &&
			isUserLoggedIn
		) {
			setDisplay(1)
			if (!data.lng || !data.lat)
				geocode(data.address, ({ lat, lng }) =>
					fetchRequest('POST', { ...data, lng: lng, lat: lat }, 'help_requests', fetchCallback)
				)
			else fetchRequest('POST', data, 'help_requests', fetchCallback)
		}
	}

	const fetchCallback = r => {
		if (r.status === 201) setDisplay(2)
		else {
			setDisplay(0)
			toggleBanner(AutomaticMessage())
		}
	}

	const acquireLocation = () =>
		navigator.geolocation.getCurrentPosition(pos =>
			reverseGeocode({ lat: pos.coords.latitude, lng: pos.coords.longitude }, addr =>
				setData({ ...data, address: addr, lat: pos.coords.latitude, lng: pos.coords.longitude })
			)
		)

	return (
		<Form onSubmit={onSubmit}>
			<InputForm
				label='Title'
				name='title'
				placeholder='Request title'
				value={data.title}
				error={errors.title}
				onChange={onChange}
				display={display}
			/>
			<InputForm
				label='Request type'
				name='help_type'
				type='select'
				value={data.help_type}
				onChange={onChange}
				error={errors.help_type}
				display={display}>
				<option>One-time help</option>
				<option>Material</option>
			</InputForm>
			<Form.Row>
				<InputForm
					label='Address'
					name='address'
					placeholder='Help address'
					value={data.address}
					error={errors.address}
					onChange={onChange}
					display={display}
				/>
				<Form.Group>
					<Button onClick={acquireLocation}>
						<ExploreIcon />
					</Button>
				</Form.Group>
			</Form.Row>
			<InputForm
				label='Description'
				name='description'
				placeholder='Define your help request'
				type='textarea'
				rows={5}
				value={data.description}
				error={errors.description}
				onChange={onChange}
				display={display}
				text={
					data.description.length > 0
						? `${300 - data.description.length} characters remaining`
						: 'Maximum 300 characters'
				}
			/>
			<LoadingButton variant='primary' type='submit' display={display}>
				Submit
			</LoadingButton>
		</Form>
	)
}
