import React, { useState, useEffect } from 'react'

import DoublePane from '../components/decorations/DoublePane'
import Conversation from '../components/Conversation'
import InputForm from '../components/decorations/InputForm'
import LoadingButton from '../components/decorations/LoadingButton'
import LoadingSpinner from '../components/decorations/LoadingSpinner'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

export default function ConversationHandler({ conversations }) {
	useEffect(() => {
		console.log('RECEIVED convo in handler')
		console.log(conversations)
	}, [conversations])

	const leftPaneWidth = 2

	return (
		<div className='conversation-handler'>
			<DoublePane leftPane={leftPaneWidth}>
				{conversations.map((c, k) => (
					<Conversation key={k} title={c.help_request_title} />
				))}
			</DoublePane>
			<Card className='input-area'>
				<Row>
					<Col lg={leftPaneWidth}></Col>
					<Col lg={12 - leftPaneWidth}>
						<Card.Body>
							<Form>
								<Row>
									<InputForm name='chat' />
									<LoadingButton variant='primary' type='submit'>
										Submit
									</LoadingButton>
								</Row>
							</Form>
						</Card.Body>
					</Col>
				</Row>
			</Card>
		</div>
	)
}
