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
	const payload = req.body
	let service = services.find(s => s.id === serviceName)

	// We need a payload to know what to deploy.
	if (!payload) {
		return res.status(400).send('Empty payload')
	}

	// Does the service exist?
	if (!service) {
		return res.status(404).send(`Service Does Not Exist`)
	}

	// Was the deployment branch pushed?
	if (!payload.ref.endsWith(service.branch)) {
		return res.status(403).send(`Not deploying ${payload.ref}`)
	}

	// Make sure the service's repo is the one that was pushed.
	else if (
		!payload.repository
		|| !payload.repository.ssh_url
		|| payload.repository.ssh_url !== service.repo
	) {
		return res.status(400).send('Trying to deploy the wrong service')
	}

	// Does the folder exist on disk? Create it otherwise.
	if (!fs.existsSync(service.path)) {
		try {
			mkdirp.sync(service.path)
		} catch (e) {
			return res.status(500).send(`Failed to create folder ${service.path}`)
		}
	}

	// Build the paths for current and release folders.
	const currentReleaseLink = path.join(service.path, 'current')
	const releasePath = path.join(service.path, generateReleaseName())

	// Change to the service's folder.
	process.chdir(service.path)

	// Clone the new release.
	exec(`git clone ${service.repo} ${releasePath}`)

	// Step into the new release.
	process.chdir(releasePath)

	// Execute each of the service's deploy commands.
	service.commands.forEach(exec)

	// Symlink to the new release to activate it.
	exec(`ln -sfn ${releasePath} ${currentReleaseLink}`)

	// Everything's fine.
	return res.sendStatus(201)
}

module.exports = deploy
