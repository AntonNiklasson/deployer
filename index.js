#! /usr/bin/env nodejs

const express = require('express')
const process = require('process')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').execSync
const bodyParser = require('body-parser')
const services = require('./services')

const logger = console

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send(services)
})

app.get('/deploy/:service', (req, res) => {
	const service = services[req.params.service]

	if(service && fs.existsSync(service.path)) {
		const currentReleasePath = 'current'
		const releasePath = (new Date()).getTime()

		// Go to the service root folder.
		logger.log(`cd ${service.path}`)
		process.chdir(service.path)

		// Clone the new release.
		logger.log(`git clone ${service.repo} ${releasePath}`)
		exec(`git clone ${service.repo} ${releasePath}`)

		// Step into the new release.
		logger.log(`cd ${path.join(service.path, releasePath.toString())}`)
		process.chdir(path.join(service.path, releasePath.toString()))

		// Execute each of the service's deploy commands.
		service.commands.forEach(cmd => {
			logger.log(`Running '${cmd}'...`)
			exec(cmd)
		})

		// Step out of the release folder.
		logger.log(`cd ..`)
		process.chdir('..')

		// Activate the new release.
		logger.log(`ln -s ${releasePath} ${currentReleasePath}`)
		exec(`ln -s ${releasePath} ${currentReleasePath}`)

		res.end()
	} else {
		res.sendStatus(404)
	}
})

app.listen(8888, 'localhost')
