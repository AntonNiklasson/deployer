const app = require('express')()
const bodyParser = require('body-parser')
const services = require('../services')

app.use(bodyParser.json())

app.get('/', (req, res) => {
	return res.send(services.map(s => s.id))
})

app.post('/deploy/:service', require('./deploy'))
app.use('*', (req, res) => { res.sendStatus(404) })

module.exports = app.listen(8888, 'localhost')
