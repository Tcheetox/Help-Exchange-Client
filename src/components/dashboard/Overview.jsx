import React, { useState, useEffect, useContext } from 'react'

import Paginator from './helpRequest/Paginator'
import { AppData } from '../../AppData'

export default function Overview() {
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
			<h4>Pending requests</h4>
			{data.length > 0 ? <Paginator data={data} /> : 'Nothing to show... lazy fucker!'}
			<h4>History</h4>
			{histoData.length > 0 ? <Paginator data={histoData} /> : "You haven't done much have you?"}
		</div>
	)
}
