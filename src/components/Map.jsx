import React, { useState, useEffect, useRef } from 'react'

export default function Map() {
	const mapRef = useRef()
	//const [mapCenter, setMapCenter] = useState({})

	useEffect(() => {
		let map = new window.google.maps.Map(mapRef.current, {
			center: { lat: -34.397, lng: 150.644 }, // TODO: change later on
			zoom: 8,
		})
		navigator.geolocation.getCurrentPosition(position => {
			console.log(position)
			map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
			//setMapCenter({latitude: position.})
		})
	}, [])

	return <div style={{ height: '100vh', width: '100%' }} ref={mapRef} />
}
