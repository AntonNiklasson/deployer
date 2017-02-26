#! /usr/bin/env nodejs

const express = require('express')
const process = require('process')
const fs = require('fs')
const exec = require('child_process').exec
const bodyParser = require('body-parser')
const services = require('./services')

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send(Object.keys(services))
})

app.get('/deploy/:service', (req, res) => {
	const service = services[req.params.service]

	if(service && fs.existsSync(service.path)) {
		const currentReleasePath = 'current'
		const releasePath = (new Date()).getTime()

		// Go to the service root folder.
		process.chdir(service.path)

		// Clone the new release.
		exec(`git clone ${service.repo} ${releasePath}`)

		// Step into the new release.
		process.chdir(releasePath)

		// Execute each of the service's deploy commands.
		service.commands.forEach(cmd => {
			exec(cmd, (err) => {
				if(err) {
					res.status(500).end()
				}
			})
		})

		// Step out of the release folder.
		process.chdir('..')

		// Activate the new release.
		exec(`ln -s ${releasePath} ${currentReleasePath}`)

		res.end()
	} else {
		res.sendStatus(404)
	}
})

app.listen(8888, 'localhost')
