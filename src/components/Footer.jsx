import React from 'react'
import Container from 'react-bootstrap/Container'

export default function Footer() {
	return (
		<footer id='Footer' className='footer-wrapper bg-dark'>
			<Container className='text-center'>
				<ul className='socials list-unstyled list-inline'>
					<li className='list-inline-item'>
						<a href='https://github.com/Tcheetox?tab=repositories' target='_blank' rel='noopener noreferrer'>
							FOOTER STUFF1
						</a>
					</li>
					<li className='list-inline-item'>
						<a href='https://www.instagram.com/krgramsta/' target='_blank' rel='noopener noreferrer'>
							FOOTER STUFF2
						</a>
					</li>
					<li className='list-inline-item'>
						<a href='https://www.linkedin.com/in/krenier/' target='_blank' rel='noopener noreferrer'>
							FOOTER STUFF3
						</a>
					</li>
				</ul>
				<hr />
				<div className='footer-copyright'>© 2020 Copyright Kévin Renier. All rights reserved.</div>
			</Container>
		</footer>
	)
}
