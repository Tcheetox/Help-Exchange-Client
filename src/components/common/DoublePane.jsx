import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function DoublePane({
	children,
	title = '',
	leftPane = 3,
	defaultActivePane = 0,
	setActivePane = null,
}) {
	const [pane, setPane] = useState(defaultActivePane)

	const tabTitle = (x, i) => (
		<div key={i} className={`tab-title ${i === pane ? 'active' : ''}`} onClick={() => setPane(i)}>
			<Card.Title>{x}</Card.Title>
		</div>
	)

	// The below useEffect is necessary to ensure we can navigate from a nested section to the parent
	useEffect(() => setPane(defaultActivePane), [defaultActivePane])
	// Trigger setActivePane callback to warn parent component of currently displayed item
	useEffect(() => children.length && setActivePane && setActivePane(children[pane].props), [
		pane,
		children,
		setActivePane,
	])

	return (
		<Card className={`double-pane ${title}`}>
			<Row>
				<Col lg={leftPane} className='tab-col'>
					{Array.isArray(children)
						? children.map((x, i) => tabTitle(x.props.title, i))
						: tabTitle(children.props.title, 0)}
					<div className='filler' />
				</Col>
				<Col lg={12 - leftPane} className='content-col'>
					<Card.Body>{Array.isArray(children) ? children[pane] : children}</Card.Body>
				</Col>
			</Row>
		</Card>
	)
}
