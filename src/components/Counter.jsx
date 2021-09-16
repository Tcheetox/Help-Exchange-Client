import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { AppData } from '../AppData'
import Card from 'react-bootstrap/Card'

export default function Counter() {
	const { helpRequests } = useContext(AppData)
	const [posClass, setPosClass] = useState('')
	const location = useLocation()
	const history = useHistory()

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

	const handleClick = () => {
		if (location.pathname.includes('/map/') && location.pathname.includes(';') && helpRequests && helpRequests.length > 0) {
			const centerSplit = location.pathname.replace('/map/', '').split(';')
			const center = { lat: parseFloat(centerSplit[0]), lng: parseFloat(centerSplit[1]) }
			let targetRequest = 0
			for (let i = 0; i < helpRequests.length; i++) {
				if (helpRequests[i].lat === center.lat && helpRequests[i].lng === center.lng) {
					targetRequest = i + 1 < helpRequests.length ? i + 1 : 0
					break
				}
			}
			history.push(`/map/${helpRequests[targetRequest].lat};${helpRequests[targetRequest].lng}`)
		} else if (helpRequests && helpRequests.length > 0) history.push(`/map/${helpRequests[0].lat};${helpRequests[0].lng}`)
	}

	if (helpRequests && helpRequests.length > 0)
		return (
			<Card className={`counter ${posClass}`}>
				<Card.Body>
					<div className='numbers' onClick={handleClick}>
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
		)
	else return null
}
