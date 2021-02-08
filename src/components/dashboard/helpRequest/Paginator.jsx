import React, { useState } from 'react'

import Pagination from 'react-bootstrap/Pagination'
import HelpRequest from './HelpRequest'
import Accordion from 'react-bootstrap/Accordion'

export default function Paginator({ data }) {
	const itemsPerPage = 5
	const [activePage, setActivePage] = useState(0)
	const pages = [...Array(Math.ceil(data.length / itemsPerPage)).keys()]

	return (
		<div className='paginator'>
			<Accordion>
				{data.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage).map((x, k) => (
					<HelpRequest eventKey={k + 1} key={k} data={x} />
				))}
			</Accordion>
			<Pagination size='sm'>
				{pages.length > 0 &&
					pages.map((x, k) => (
						<Pagination.Item key={k} active={k === activePage} onClick={() => setActivePage(k)}>
							{k + 1}
						</Pagination.Item>
					))}
			</Pagination>
		</div>
	)
}
