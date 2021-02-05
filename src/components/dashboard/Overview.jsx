import React, { useState, useEffect, useContext } from 'react'

import Paginator from './help_request/Paginator'
import { AppContext } from '../../AppContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function Overview() {
	const { fetchRequest, isUserLoggedIn } = useContext(AppContext)
	const [data, setData] = useState({})
	const [fetching, setFetching] = useState(false)
	const [histoData, setHistoData] = useState({})

	const splitRequests = reqs => {
		const pendingReqs = reqs.filter(req => req.status === 'pending' || req.status === 'published')
		setData(pendingReqs)
		setHistoData(reqs.filter(req => !pendingReqs.includes(req)))
	}

	useEffect(() => {
		if (isUserLoggedIn) {
			setFetching(true)
			fetchRequest('GET', null, 'help_requests/user', (r, pR) => {
				if (r.status === 200 && pR.length > 0) splitRequests(pR)
				setFetching(false)
			})
		}
	}, [isUserLoggedIn, fetchRequest])

	const onRequestUpdated = req => {
		const dataCopy = [...data, ...histoData]
		const reqIndex = dataCopy.findIndex(r => r.id === req.id)
		if (reqIndex !== -1) {
			dataCopy[reqIndex] = req
			splitRequests(dataCopy)
		}
	}

	return (
		<div className='overview-pane'>
			<h4>Pending requests</h4>
			{fetching ? (
				<LoadingSpinner />
			) : data.length > 0 ? (
				<Paginator onRequestUpdated={onRequestUpdated} data={data} />
			) : (
				'Nothing to show... lazy fucker!'
			)}
			<h4>History</h4>
			{fetching ? (
				<LoadingSpinner />
			) : histoData.length > 0 ? (
				<Paginator onRequestUpdated={onRequestUpdated} data={histoData} />
			) : (
				"You haven't done much have you?"
			)}
		</div>
	)
}
