import React from 'react'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InstagramIcon from '@material-ui/icons/Instagram'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'

export default function Footer() {
	return (
		<footer id='Footer' className='footer'>
			<Container>
				<Row className='links'>
					<Col xs={3} className='brand'>
						<h3>Fish For Help</h3>
						<h6>Never be alone, we are stronger together.</h6>
					</Col>
					<Col xs={3}>
						<h5>Links</h5>
						<ul>
							<li>
								<Link to='/#About'>About us</Link>
							</li>
							<li>
								<Link to='/map'>Map</Link>
							</li>
							<li>
								<Link to='/faq'>FAQ</Link>
							</li>
						</ul>
					</Col>
					<Col xs={3}>
						<h5>Contact</h5>
						<ul>
							<li>
								<a href='mailto:fishforhelp@thekecha.com?subject=Support request'>Support</a>
							</li>
						</ul>
					</Col>
					<Col xs={3}>
						<h5>Follow us</h5>
						<ul className='socials'>
							<li>
								<FacebookIcon className='facebook' />
								<a href='https://www.facebook.com' target='_blank' rel='noreferrer'>
									Facebook
								</a>
							</li>
							<li>
								<InstagramIcon className='instagram' />
								<a href='https://www.instagram.com' target='_blank' rel='noreferrer'>
									Instagram
								</a>
							</li>
							<li>
								<TwitterIcon className='twitter' />
								<a href='https://twitter.com' target='_blank' rel='noreferrer'>
									Twitter
								</a>
							</li>
						</ul>
					</Col>
				</Row>
				<hr />
				<div className='copyright'>
					© 2021 Copyright <a href='/'>Fish For Help</a>. All rights reserved.
				</div>
			</Container>
		</footer>
	)
}
