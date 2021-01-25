import React, { useState, useEffect, useContext } from 'react'

import { geocode, reverseGeocode } from '../../utilities'

import Form from 'react-bootstrap/Form'
import InputForm from '../decorations/InputForm'
import LoadingButton from '../decorations/LoadingButton'
import Button from 'react-bootstrap/Button'
import ExploreIcon from '@material-ui/icons/Explore'
import { AppContext } from '../../AppContext'

export default function CreateRequest() {
	const { fetchRequest, isUserLoggedIn } = useContext(AppContext)
	const [display, setDisplay] = useState(0)
	const [data, setData] = useState({
		title: '',
		description: '',
		type: '',
		address: '',
		lng: null,
		lat: null,
	})
	const [errors, setErrors] = useState({
		title: undefined,
		description: undefined,
		address: undefined,
	})

	useEffect(() => {
		if (isUserLoggedIn)
			fetchRequest('GET', null, 'users/edit', (r, pR) => {
				if (r.status === 200)
					setData(d => {
						return { ...d, address: pR.address, lng: pR.lng, lat: pR.lat }
					})
			})
	}, [fetchRequest, isUserLoggedIn])

	const onChange = e => {
		if (
			e.target.name !== 'description' ||
			(e.target.name === 'description' && e.target.value.length <= 300)
		) {
			setData({ ...data, [e.target.name]: e.target.value })
			setErrors({ ...errors, [e.target.name]: undefined })
			// TODO: make sure the lat and lng always represent the provided location
		}
	}

	const onSubmit = e => {
		e.preventDefault()
	}

	//const [location, setLocation] = useState({})
	//const testLocation = () => navigator.geolocation.getCurrentPosition(pos => setLocation(pos))

	// useEffect(() => {
	// 	console.log('LOCATION HAS CHANGED')
	// 	console.log(location)
	// }, [location])

	const acquireLocation = () => {
		//geocode(data.address, r => alert(r.lng))
		reverseGeocode({ lat: 40.714232, lng: -73.9612889 }, a => alert(a))
		// navigator.geolocation.getCurrentPosition(pos => {
		// 	const geocoder = new google.maps.Geocoder()
		// 	geocoder.geocode({ address: data.address }, function (results, status) {
		// 		if (status == 'OK') {
		// 			console.log(results)
		// 			alert('OK check console!')
		// 		} else {
		// 			alert('Geocode was not successful for the following reason: ' + status)
		// 		}
		// 	})
		// })
	}

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
				name='type'
				type='select'
				value={data.type}
				onChange={onChange}
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
				<Button onClick={acquireLocation}>
					<ExploreIcon />
				</Button>
			</Form.Row>
			<InputForm
				label='Description'
				name='description'
				placeholder='Define your help request'
				type='textarea'
				rows={5}
				value={data.description}
				error={errors.title}
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
