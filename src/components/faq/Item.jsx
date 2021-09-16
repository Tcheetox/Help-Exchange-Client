import React from 'react'
import { Link } from 'react-router-dom'

export default function Item({ question, response }) {
	const hyperlinks = [
		{ tag: 'your profile', compo: <Link to={'users/account'}>your profile</Link> },
		{ tag: 'delete your account', compo: <Link to={'users/account/delete'}>delete your account</Link> },
		{ tag: 'dashboard', compo: <Link to={'users/dashboard'}>dashboard</Link> },
		{ tag: 'support', compo: <a href='mailto:fishforhelp@thekecha.com?subject=Support request'>support</a> },
		{ tag: 'Terms and Services', compo: <Link to={'/#'}>Terms and Services</Link> },
	]

	const renderHyperlinks = () => {
		let responseElements = []
		const splittedRepsonse = response.split(new RegExp(hyperlinks.map(h => `(${h.tag})`).join('|'), 'g')).filter(Boolean)
		splittedRepsonse.forEach((e, i) => {
			const hyperIndex = hyperlinks.findIndex(h => h.tag === e)
			if (hyperIndex !== -1) responseElements.push(<span key={i}>{hyperlinks[hyperIndex].compo}</span>)
			else responseElements.push(<span key={i}>{e}</span>)
		})
		return responseElements
	}

	return (
		<div className='item'>
			<div className='question'>
				<h3>{question}</h3>
			</div>
			<div className='response'>{renderHyperlinks()}</div>
		</div>
	)
}
