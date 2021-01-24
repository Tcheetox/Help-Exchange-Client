export const isValidEmail = email => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email).toLowerCase())
}

export const isBlank = str => !str || /^\s*$/.test(str)

export const logError = err =>
	console.log(
		`! ERROR (${'name' in err ? err.name : 'UNKNOWN'}):\n${'message' in err ? err.message : 'UNKNOWN'}`
	)
