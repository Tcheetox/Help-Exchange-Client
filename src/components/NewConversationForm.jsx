import React from 'react'

class NewConversationForm extends React.Component {
	state = {
		title: '',
	}

	handleChange = e => {
		this.setState({ title: e.target.value })
	}

	handleSubmit = e => {
		e.preventDefault()
		fetch(`http://localhost:3000/api/v1/conversations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(this.state),
		})
		this.setState({ title: '' })
	}

	render = () => {
		return (
			<div className='newConversationForm'>
				<form onSubmit={this.handleSubmit}>
					<label>New Conversation:</label>
					<br />
					<input type='text' value={this.state.title} onChange={this.handleChange} />
					<input type='submit' />
				</form>
			</div>
		)
	}
}

export default NewConversationForm
