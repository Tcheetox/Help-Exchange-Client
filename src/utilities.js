export const isValidEmail = email => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email).toLowerCase())
}

export const isBlank = str => !str || /^\s*$/.test(str)
export const shouldShowInvalid = err => err !== undefined && err.length > 0
export const shouldShowValid = (err, display = 0) => err !== undefined && err === '' && display !== 1

export const logError = err =>
	console.log(
		`! ERROR (${'name' in err ? err.name : 'UNKNOWN'}):\n${'message' in err ? err.message : 'UNKNOWN'}`
	)
