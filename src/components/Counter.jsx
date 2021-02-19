import React, { useState, useEffect, useContext, useRef } from 'react'

import { AppData } from '../AppData'
import Card from 'react-bootstrap/Card'

export default function Counter() {
	const { helpRequests } = useContext(AppData)
	const [topOffset, setTopOffset] = useState(0)
	const headerRef = useRef

	useEffect(() => {
		headerRef.current = document.querySelector('.header')
		const onScroll = () => {
			if (headerRef.current) {
				if (window.scrollY > headerRef.current.offsetHeight) setTopOffset(-75)
				else setTopOffset(-window.scrollY)
			}
		}
		document.addEventListener('scroll', onScroll)
		return () => document.removeEventListener('scroll', onScroll)
	}, [headerRef])

	return helpRequests && helpRequests.length ? (
		<Card className='counter' style={{ transform: `translateY(${topOffset}px)` }}>
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
