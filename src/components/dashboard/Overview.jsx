import React, { useState, useEffect, useContext } from 'react'

import Paginator from './helpRequest/Paginator'
import { AppData } from '../../AppData'

export default function Overview({ showRequest }) {
	const { userHelpRequests } = useContext(AppData)
	const [data, setData] = useState([])
	const [histoData, setHistoData] = useState([])

	useEffect(() => {
		const pendingReqs = userHelpRequests.length
			? userHelpRequests.filter(req => req.status === 'pending' || req.status === 'published')
			: []
		setData(pendingReqs)
		setHistoData(
			pendingReqs.length ? userHelpRequests.filter(req => !pendingReqs.includes(req)) : userHelpRequests
		)
	}, [userHelpRequests])

	return (
		<div className='overview-pane'>
			<h4>Ongoing requests</h4>
			{data.length > 0 ? <Paginator data={data} showRequest={showRequest} /> : 'Nothing to show...'}
			<h4>History</h4>
			{histoData.length > 0 ? (
				<Paginator data={histoData} showRequest={showRequest} />
			) : (
				"You haven't done much have you?"
			)}
		</div>
	)
}
