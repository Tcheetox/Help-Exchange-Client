import React from 'react'
import { Link } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Counter from '../components/Counter'

export default function Home() {
	return (
		<>
			<Counter />
			<Container className='core'>
				<div id='Home' className='home'>
					<div className='headline'>
						<div>Let's</div>
						<div className='brand'>Fish For Help</div>
						<div className='intro'>
							<h3>
								Do you feel left out, even for the simplest task? <br /> Your neighbors are willing to help.
							</h3>
							<a href='#About'>
								<Button className='plain-red large'>Learn more</Button>
							</a>
						</div>
					</div>
				</div>
				<div id='About' className='about'>
					<Row>
						<Col xs={5}>
							<div className='image mutual' />
						</Col>
						<Col xs={5} className='text mutual'>
							<h3>
								Together we are stronger, don't let yourself being <span className='bold'>overwhelmed</span>.
							</h3>
						</Col>
					</Row>
					<Row>
						<Col xs={3} />
						<Col xs={5} className='text elder'>
							<h3>
								<span className='bold'>Fish For Help</span> is a free platform that enables mutual aid and
								foster caring in your region.
							</h3>
						</Col>
						<Col xs={4}>
							<div className='image elder' />
						</Col>
					</Row>
					<Row>
						<Col xs={5} className='foster'>
							<div className='image foster' />
						</Col>
						<Col xs={5} className='text foster'>
							<div>
								<h3>
									Our process couldn't be <span className='bold'>simpler</span>:
								</h3>
								<ul>
									<li>
										<h4>
											<Link to='users/signup#Header'>Sign up</Link>
										</h4>
									</li>
									<li>
										<h4>Complete your profile</h4>
									</li>
									<li>
										<h4>Ask and propose your help!</h4>
									</li>
								</ul>
							</div>
						</Col>
					</Row>
				</div>
			</Container>
		</>
	)
}
