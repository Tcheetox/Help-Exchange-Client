import React, { useState, useContext, useEffect } from 'react'

import { search } from 'ss-search'
import { AppContext } from '../../AppContext'
import Item from './Item'
import InputForm from '../common/InputForm'

export default function SmartFaq() {
	const { fetchRequest } = useContext(AppContext)
	const [searchField, setSearchField] = useState('')
	const [data, setData] = useState([])
	const [filteredData, setFilteredData] = useState([])

	// Trigger initial fetch
	useEffect(
		() =>
			fetchRequest(
				'GET',
				null,
				'faq',
				(r, pR) => {
					if (r.status === 200) {
						setData(pR)
						setFilteredData(pR)
					}
				},
				false
			),
		[fetchRequest]
	)

	const handleSearch = e => {
		if (e.target.value !== '')
			setFilteredData(() => search(data, ['question', 'response', 'keywords'], e.target.value))
		else setFilteredData(data)
		setSearchField(e.target.value)
	}

	return (
		<div className='faq'>
			<h1>FAQ</h1>
			<InputForm
				name='searchField'
				placeholder='Search for frequently asked questions by theme, keywords, etc.'
				value={searchField}
				onChange={handleSearch}
			/>
			{filteredData.map((q, i) => (
				<Item key={i} question={q.question} response={q.response} />
			))}
		</div>
	)
}
