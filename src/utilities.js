export const isValidEmail = email => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email).toLowerCase())
}

export const isBlank = str => !str || /^\s*$/.test(str)

export const titleize = str => str.charAt(0).toUpperCase() + str.slice(1)

export const logError = err =>
	console.log(`! ERROR (${'name' in err ? err.name : 'UNKNOWN'}):\n${'message' in err ? err.message : 'UNKNOWN'}`)

export const geocode = async (address, callback) => {
	let location = { lat: null, lng: null }
	if (address.length > 0) {
		try {
			const resp = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${process.env.REACT_APP_GOOGLE_GEOCODE_KEY}`
			)
			const parsedResp = await resp.json()
			if (parsedResp.results[0])
				location = {
					lat: parsedResp.results[0].geometry.location.lat,
					lng: parsedResp.results[0].geometry.location.lng,
				}
		} catch (error) {
			logError(error)
		}
	}
	callback(location)
}

export const reverseGeocode = async ({ lat, lng }, callback) => {
	let address = ''
	if (lat && lng) {
		try {
			const resp = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_GEOCODE_KEY}`
			)
			const parsedResp = await resp.json()
			address = parsedResp.results[0].formatted_address
		} catch (error) {
			logError(error)
		}
	}
	callback(address)
}
