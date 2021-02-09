import React, { useState, useEffect, useContext, useRef } from 'react'

import { AppData } from '../../AppData'
import { AppContext } from '../../AppContext'
import GoogleMapReact from 'google-map-react'
import { MarkerMemo } from './Marker'
import { logError } from '../../utilities'
import publicIP from 'react-native-public-ip'

// https://github.com/google-map-react/google-map-react/blob/HEAD/API.md
// https://developers.google.com/maps/documentation/javascript/controls

// TODO: center should adapt dynamically to uesr location -> UE!!!
// TODO: user current location icon
// TODO: create setting button: terrains - fullscreen - use current position (>>> Bottom position fixed/static but above HEADER!!!)

export default function GoogleMap() {
	const { userProfile } = useContext(AppContext)
	const { helpRequests, refreshHelpRequests } = useContext(AppData)
	const [center, setCenter] = useState({ lat: null, lng: null })
	const userProfileRef = useRef()
	userProfileRef.current = userProfile

	// Trigger refresh of help requests (filtered from the backend by status: published)
	useEffect(() => refreshHelpRequests(), [refreshHelpRequests])

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
		if (userProfile && userProfile.lat && userProfile.lng) {
			setCenter({ lat: null, lng: null }) // TODO: test hijack this shitty module
			setCenter({ lat: userProfile.lat, lng: userProfile.lng })
		} else if (hasGeolocationPermission())
			navigator.geolocation.getCurrentPosition(pos => {
				if (!userProfileRef.current || !userProfileRef.current.lat || !userProfileRef.current.lng)
					setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
			})
		else {
			try {
				publicIP().then(ip =>
					fetch(
						`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IP_GEOLOCATION_KEY}&ip=${ip}`
					)
						.then(resp => resp.json())
						.then(pos => {
							if (!userProfileRef.current || !userProfileRef.current.lat || !userProfileRef.current.lng)
								setCenter({ lat: parseFloat(pos.latitude), lng: parseFloat(pos.longitude) })
						})
				)
			} catch (error) {
				setCenter({ lat: 46.2044, lng: 6.1432 }) // Default to Geneva
				logError(error)
			}
		}
	}, [userProfile])

	return (
		<div className='map'>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
				center={center}
				options={{ zoomControl: false, fullscreenControl: false }}
				//defaultMapTypeId={'TERRAIN'}
				zoomControl={false}
				defaultZoom={12}>
				{helpRequests.map((h, i) => (
					<MarkerMemo key={i} lat={h.lat} lng={h.lng} helpRequest={h} />
				))}
			</GoogleMapReact>
		</div>
	)
}
