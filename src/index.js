#! /usr/bin/env nodejs

const express = require('express')
const bodyParser = require('body-parser')
const services = require('./services')

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send(Object.keys(services))
})

app.post('/deploy/:service', require('./deploy'))

module.exports = app.listen(8888, 'localhost')
