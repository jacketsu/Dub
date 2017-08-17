'use strict'

module.exports = {
	header: {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	},
	api: {
		base: '',
		creations: 'api/creations',
		comment: 'api/comments',
		up: 'api/up',
		signup: 'api/u/signup',
		verify: 'api/u/verify'
	}
}