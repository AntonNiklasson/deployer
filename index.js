#! /usr/bin/env nodejs

const express = require('express')
const process = require('process')
const fs = require('fs')
const exec = require('child_process').exec
const bodyParser = require('body-parser')
const services = require('./services')

const app = express()
app.use(bodyParser.json())

app.get('/deploy/:service', (req, res) => {
	const service = services[req.params.service]

	if(service && fs.existsSync(service.path)) {
		const currentReleasePath = 'current'
		const releasePath = (new Date()).getTime()

		// Move to the services root folder.
		process.chdir(service.path)

		// Clone a new instance of the repo.
		exec(`git clone ${service.repo} ${releasePath}`)

		// Execute each of the service's commands.
		service.commands.forEach(cmd => {
			exec(cmd, (err) => {
				if(err) {
					console.log(err	)
					res.status(500).end()
				}
			})
		})

		// Symlink ./current to the new release.
		exec(`ln -s ${releasePath} ${currentReleasePath}`)

		res.end()
	} else {
		console.log(service)
		res.sendStatus(404)
	}
})

app.listen(8888)
