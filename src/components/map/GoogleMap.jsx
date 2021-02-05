import React, { useState, useEffect, useContext, useRef } from 'react'

import { AppContext } from '../../AppContext'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'

// https://github.com/google-map-react/google-map-react/blob/HEAD/API.md
// https://developers.google.com/maps/documentation/javascript/controls

// TODO: create basic marker
// TODO: create setting button: terrains - fullscreen - use current position (>>> Bottom position fixed/static but above HEADER!!!)

export default function GoogleMap() {
	const { fetchRequest, isUserLoggedIn, userProfile } = useContext(AppContext)
	const [data, setData] = useState([])
	const [center, setCenter] = useState({ lat: 46.2044, lng: 6.1432 })
	const centerRef = useRef()
	centerRef.current = center

	// Fetch help requests (filtered from the backend by status: published)
	useEffect(
		() => fetchRequest('GET', null, 'help_requests', (r, pR) => r.status === 200 && setData(pR), false),
		[fetchRequest]
	)

	// Center map: use profile info otherwise attempt to find IP location
	useEffect(() => {
		if (isUserLoggedIn && userProfile && userProfile.lat && userProfile.lng)
			setCenter({ lat: userProfile.lat, lng: userProfile.lng })
		else {
			if (!centerRef.current || !centerRef.current.lat || !centerRef.current.lng)
				console.log('CHANGE THE CENTER BY THE NEWLY OBTAINE VALUE HERE!!!!')
		}
	}, [isUserLoggedIn, userProfile])

	// TODO: IT FUCKING COESN4T CHANGE THE CENTER!!!!!!
	useEffect(() => {
		console.log('MAP CENTER SHOULD BE:')
		console.log(center)
	}, [center])

	return (
		<div className='map'>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
				defaultCenter={center}
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
