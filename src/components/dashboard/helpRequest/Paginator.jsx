import React, { useState, useEffect } from 'react'

import Pagination from 'react-bootstrap/Pagination'
import HelpRequest from './HelpRequest'
import Accordion from 'react-bootstrap/Accordion'

export default function Paginator({ data, showRequest }) {
	const itemsPerPage = 5
	const [activePage, setActivePage] = useState(0)
	const [activeKey, setActiveKey] = useState(0)
	const pages = [...Array(Math.ceil(data.length / itemsPerPage)).keys()]

	useEffect(() => {
		if (data.length && showRequest) {
			const requestIndex = data.findIndex(h => h.id === parseInt(showRequest))
			if (requestIndex !== undefined && requestIndex !== -1) {
				let newPage = Math.ceil((requestIndex + 1) / itemsPerPage) - 1
				newPage = newPage < 0 ? 0 : newPage
				setActivePage(newPage)
				setActiveKey(requestIndex + 1 - itemsPerPage * newPage)
			}
		}
	}, [data, showRequest])

	return (
		<div className='paginator'>
			<Accordion activeKey={activeKey}>
				{data.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage).map((x, k) => (
					<div key={k} onClick={() => (k + 1 === activeKey ? setActiveKey(0) : setActiveKey(k + 1))}>
						<HelpRequest key={k} data={x} eventKey={k + 1} active={k + 1 === activeKey} />
					</div>
				))}
			</Accordion>
			<Pagination size='sm'>
				{pages.length > 0 &&
					pages.map((x, k) => (
						<Pagination.Item
							key={k}
							active={k === activePage}
							onClick={() => {
								setActiveKey(0)
								setActivePage(k)
							}}>
							{k + 1}
						</Pagination.Item>
					))}
			</Pagination>
		</div>
	)
}
