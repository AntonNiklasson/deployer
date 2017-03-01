const request = require('supertest')
let app
let agent

describe('/deploy/:service', () => {

	beforeEach(() => {
		app = require('../src/index.js')
		agent = request(app)
	})

	afterEach(() => {
		app.close()
	})

	it('should answer 200 on /', () => {
		return agent.get('/').expect(200)
	})

	it('should answer 404 if service does not exist', () => {
		return agent
			.post('/deploy/nonexistingservice')
			.expect(response => {
				expect(response.status).toBe(404)
			})
	})

	it('should give 200 if deploying some other branch', () => {
		return agent
			.post('/deploy/bowtie-api')
			.field('ref', 'develop')
			.expect(response => {
				expect(response.status).toBe(200)
			})
	})
})
