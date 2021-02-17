import React from 'react'

import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import CheckIcon from '@material-ui/icons/Check'

export default function LoadingButton({ className, children, variant, type, onClick, name, display = 0 }) {
	return (
		<Button
			variant={display === 2 ? 'success' : variant}
			type={type}
			disabled={display === 1 || display === 2}
			onClick={onClick}
			name={name}
			className={
				display === 1
					? `${className} loading button-spin`
					: display === 2
					? `${className} loading button-check`
					: `${className} loading button-text`
			}>
			{display === 1 ? (
				<Spinner className='spinner-button' animation='border' />
			) : display === 2 ? (
				<CheckIcon className='check' color='inherit' />
			) : (
				children
			)}
		</Button>
	)
}
