import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function DoublePane({ children, title = '', leftPane = 3 }) {
	const [display, setDisplay] = useState(0)
	console.log(Array.isArray(children))

	const tabTitle = (x, i) => (
		<div key={i} className={`tab-title ${i === display ? 'active' : ''}`} onClick={() => setDisplay(i)}>
			<Card.Title>{x}</Card.Title>
		</div>
	)

	return (
		<Card className={`double-pane ${title}`}>
			<Row>
				<Col lg={leftPane}>
					{Array.isArray(children)
						? children.map((x, i) => tabTitle(x.props.title, i))
						: tabTitle(children.props.title, 0)}
				</Col>
				<Col lg={12 - leftPane}>
					<Card.Body>{Array.isArray(children) ? children[display] : children}</Card.Body>
				</Col>
			</Row>
		</Card>
	)
}
