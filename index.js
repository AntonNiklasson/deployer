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

	console.log(service)

	if(service && fs.existsSync(service.path)) {
		process.chdir(service.path)
		service.commands.forEach(cmd => {
			exec(cmd, (err, stdin, stdout) => {
				if(err) {
					console.log(err)
					res.status(500).end()
				}

				console.log(stdout)
			})
		})

		res.end()
	} else {
		console.log(service)
		res.sendStatus(404)
	}
})

app.listen(8888)
