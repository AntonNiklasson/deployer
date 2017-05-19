const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const services = require('../services')
const exec = require('./utils/exec')

const generateReleaseName = () => {
	return (new Date()).getTime().toString()
}

const deploy = (req, res) => {
	const serviceName = req.params.service
	const service = services[serviceName]
	const payload = req.body

	// We need a payload to know what to deploy.
	if (!payload) {
		res.status(400).send('Empty payload')
	}

	// Does the service exist?
	if (!service) {
		res.status(404).send(`Service Does Not Exist`)
	}

	// Was the deployment branch pushed?
	else if (!payload.ref.endsWith(service.branch)) {
		res.status(403).send(`Not deploying ${payload.ref}`)
	}

	// Make sure the service's repo is the one that was pushed.
	else if (
		!payload.repository
		|| !payload.repository.ssh_url
		|| payload.repository.ssh_url !== service.repo
	) {
		res.status(400).send('Trying to deploy the wrong service')
	}

	// Does the folder exist on disk? Create it otherwise.
	if (!fs.existsSync(service.path)) {
		try {
			mkdirp.sync(service.path)
		} catch (e) {
			return res.status(500).send(`Failed to create folder ${service.path}`)
		}
	}

	const currentReleaseLink = path.join(service.path, 'current')
	const releasePath = path.join(service.path, generateReleaseName())

	process.chdir(service.path)

	// Clone the new release.
	exec(`git clone ${service.repo} ${releasePath}`)

	// Step into the new release.
	process.chdir(releasePath)

	// Execute each of the service's deploy commands.
	service.commands.forEach(exec)

	// Symlink to the new release to activate it.
	exec(`ln -sfn ${releasePath} ${currentReleaseLink}`)

	res.sendStatus(201)
}

module.exports = deploy
