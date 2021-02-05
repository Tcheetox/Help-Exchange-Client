import React, { useState, useEffect, useContext, useRef } from 'react'

import { AppContext } from '../../AppContext'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'
import { logError } from '../../utilities'
import publicIP from 'react-native-public-ip'

// https://github.com/google-map-react/google-map-react/blob/HEAD/API.md
// https://developers.google.com/maps/documentation/javascript/controls

// TODO: create basic marker
// TODO: create setting button: terrains - fullscreen - use current position (>>> Bottom position fixed/static but above HEADER!!!)

export default function GoogleMap() {
	const { fetchRequest, userProfile } = useContext(AppContext)
	const [data, setData] = useState([])
	const [center, setCenter] = useState()
	const centerRef = useRef()
	centerRef.current = center

	// Fetch help requests (filtered from the backend by status: published)
	useEffect(
		() => fetchRequest('GET', null, 'help_requests', (r, pR) => r.status === 200 && setData(pR), false),
		[fetchRequest]
	)

	const hasGeolocationPermission = () => {
		try {
			navigator.permissions
				.query({
					name: 'geolocation',
				})
				.then(perm => {
					return perm.state === 'granted' ? true : false
				})
		} catch (error) {
			logError(error)
			return false
		}
	}

	// Center map: use profile info (1) otherwise check if the browser shares the info (2), fallback to ip geolocation (3)
	useEffect(() => {
		if (userProfile && userProfile.lat && userProfile.lng)
			setCenter({ lat: userProfile.lat, lng: userProfile.lng })
		else if (hasGeolocationPermission())
			navigator.geolocation.getCurrentPosition(pos =>
				setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
			)
		else if (!centerRef.current || !centerRef.current.lat || !centerRef.current.lng) {
			try {
				publicIP().then(ip =>
					fetch(
						`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IP_GEOLOCATION_KEY}&ip=${ip}`
					)
						.then(resp => resp.json())
						.then(pos => setCenter({ lat: parseFloat(pos.latitude), lng: parseFloat(pos.longitude) }))
				)
			} catch (error) {
				logError(error)
			}
		}
	}, [userProfile])

	return (
		<div className='map'>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
				defaultCenter={{ lat: 46.2044, lng: 6.1432 }} // Default to Geneva (must never change this props)
				center={center}
				options={{ zoomControl: false, fullscreenControl: false }}
				//defaultMapTypeId={'TERRAIN'}
				zoomControl={false}
				defaultZoom={12}>
				{data.map((h, i) => (
					<Marker key={i} lat={h.lat} lng={h.lng} help={h} />
				))}
			</GoogleMapReact>
		</div>
	)
}
