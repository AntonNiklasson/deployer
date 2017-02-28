#! /usr/bin/env nodejs

const express = require('express')
const bodyParser = require('body-parser')
const deploy = require('./deploy')
const services = require('./services')

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send(services)
})

app.get('/deploy/:service', (req, res) => {
	const service = services[req.params.service]

	deploy(service)

	res.sendStatus(200)
})

app.listen(8888, 'localhost')
