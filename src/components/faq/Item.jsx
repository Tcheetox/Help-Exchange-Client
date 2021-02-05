import React from 'react'
import { Link } from 'react-router-dom'

export default function Item({ question, response }) {
	const hyperlinks = [
		{ tag: 'your profile', compo: <Link to={'users/edit'}>your profile</Link> },
		{ tag: 'configuration', compo: <Link to={'users/edit'}>configuration</Link> },
	]

	const renderHyperlinks = () => {
		let responseElements = []
		const splittedRepsonse = response
			.split(new RegExp(hyperlinks.map(h => `(${h.tag})`).join('|'), 'g'))
			.filter(Boolean)
		splittedRepsonse.forEach((e, i) => {
			const hyperIndex = hyperlinks.findIndex(h => h.tag.toLowerCase() === e.toLowerCase())
			if (hyperIndex !== -1) responseElements.push(<span key={i}>{hyperlinks[hyperIndex].compo}</span>)
			else responseElements.push(<span key={i}>{e}</span>)
		})
		return responseElements
	}

	return (
		<div className='item'>
			<div className='question'>{question}</div>
			<div className='response'>{renderHyperlinks()}</div>
		</div>
	)
}
