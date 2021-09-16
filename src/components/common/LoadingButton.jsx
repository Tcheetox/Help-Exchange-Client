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
			className={(() => {
				switch (display) {
					case 1:
						return `${className} loading button-spin`
					case 2:
						return `${className} loading button-check`
					default:
						return `${className} loading button-text`
				}
			})()}>
			{(() => {
				switch (display) {
					case 1:
						return <Spinner className='spinner-button' animation='border' />
					case 2:
						return <CheckIcon className='check' color='inherit' />
					default:
						return children
				}
			})()}
		</Button>
	)
}
