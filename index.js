#! /usr/bin/env nodejs

const express = require('express')
const process = require('process')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').execSync
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
		console.log(`cd ${service.path}`)
		process.chdir(service.path)

		// Clone the new release.
		console.log(`git clone ${service.repo} ${releasePath}`)
		exec(`git clone ${service.repo} ${releasePath}`)

		// Step into the new release.
		console.log(`cd ${path.join(service.path, releasePath.toString())}`)
		process.chdir(path.join(service.path, releasePath.toString()))

		// Execute each of the service's deploy commands.
		service.commands.forEach(cmd => {
			exec(cmd, (err) => {
				console.log(`Running '${cmd}'`)
				if(err) {
					res.status(500).end()
				}
			})
		})

		// Step out of the release folder.
		console.log(`cd ..`)
		process.chdir('..')

		// Activate the new release.
		console.log(`ln -s ${releasePath} ${currentReleasePath}`)
		exec(`ln -s ${releasePath} ${currentReleasePath}`)

		res.end()
	} else {
		res.sendStatus(404)
	}
})

app.listen(8888, 'localhost')
