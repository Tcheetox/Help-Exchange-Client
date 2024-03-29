import React from 'react'

import Form from 'react-bootstrap/Form'

export default function InputForm({
	name,
	value,
	error,
	onChange,
	children,
	type = 'text',
	placeholder = '',
	label = '',
	text = '',
	display = 0,
	rows = 0,
	maxChars = 150,
	canBeInvalid = true,
	canBeValid = true,
	canBeDisabled = true,
}) {
	const shouldShowInvalid = () => error !== undefined && error.length > 0
	const shouldShowValid = () => (error !== undefined && error === '' && display !== 1) || (error === undefined && display === 2)

	const renderText = () => (
		<Form.Text className={shouldShowInvalid() ? 'invalid' : shouldShowValid() ? 'valid' : ''}>
			{shouldShowInvalid() ? error : text}
		</Form.Text>
	)

	const handleChange = e => {
		if (e.target.value.length > maxChars) e.target.value = e.target.value.substring(0, maxChars)
		onChange(e)
	}

	const renderSwitch = () => {
		switch (type) {
			case 'checkbox':
				return (
					<Form.Check
						type='checkbox'
						className={value ? 'checked' : 'unchecked'}
						id={name}
						name={name}
						checked={value}
						onChange={onChange}
						isInvalid={canBeInvalid && shouldShowInvalid()}
						isValid={canBeValid && shouldShowValid()}
						label={text}
						disabled={canBeDisabled ? display === 1 || display === 2 : false}
						custom
					/>
				)
			case 'textarea':
				return (
					<>
						<Form.Control
							as={type}
							name={name}
							placeholder={placeholder}
							value={value}
							onChange={handleChange}
							isInvalid={canBeInvalid && shouldShowInvalid()}
							isValid={canBeValid && shouldShowValid()}
							disabled={canBeDisabled ? display === 1 || display === 2 : false}
							rows={rows}
						/>
						{renderText()}
					</>
				)
			case 'select':
				return (
					<>
						<Form.Control
							as={type}
							name={name}
							onChange={onChange}
							value={value}
							isInvalid={canBeInvalid && shouldShowInvalid()}
							isValid={canBeValid && shouldShowValid()}
							disabled={canBeDisabled ? display === 1 || display === 2 : false}>
							{children}
						</Form.Control>
						{renderText()}
					</>
				)
			default:
				return (
					<>
						<Form.Control
							type={type}
							name={name}
							placeholder={placeholder}
							value={value}
							onChange={handleChange}
							isInvalid={canBeInvalid && shouldShowInvalid()}
							isValid={canBeValid && shouldShowValid()}
							disabled={canBeDisabled ? display === 1 || display === 2 : false}
						/>
						{renderText()}
					</>
				)
		}
	}

	return (
		<Form.Group>
			{label !== '' ? <Form.Label>{label}</Form.Label> : null}
			{renderSwitch()}
		</Form.Group>
	)
}
