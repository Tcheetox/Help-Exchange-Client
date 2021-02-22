import React, { useState, useEffect, useContext } from 'react'

import { AppData } from '../AppData'
import Card from 'react-bootstrap/Card'

export default function Counter() {
	const { helpRequests } = useContext(AppData)
	const [posClass, setPosClass] = useState('')

	useEffect(() => {
		const header = document.querySelector('.header')
		const onScroll = () => {
			if (header) {
				if (window.scrollY > header.offsetHeight) setPosClass('top')
				else setPosClass('')
			}
		}
		document.addEventListener('scroll', onScroll)
		return () => document.removeEventListener('scroll', onScroll)
	}, [])

	return helpRequests && helpRequests.length ? (
		<Card className={`counter ${posClass}`}>
			<Card.Body>
				<div className='numbers'>
					{helpRequests.length.toString().length < 3
						? [...Array(3 - helpRequests.length.toString().length).keys()].map(i => (
								<div key={i} className='number'>
									0
								</div>
						  ))
						: 'null'}
					{helpRequests.length
						.toString()
						.split('')
						.map((c, k) => (
							<div className='number' key={k}>
								{c}
							</div>
						))}
				</div>
				help requests
			</Card.Body>
		</Card>
	) : null
}
