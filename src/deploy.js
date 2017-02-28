const fs = require('fs')
const path = require('path')
const services = require('./services')

const logger = console

const exec = (cmd) => {
	logger.log(cmd)
	const output = require('child_process').execSync(cmd)
	logger.log(output.toString())
}

const generateReleaseName = () => {
	return (new Date()).getTime().toString()
}

const deploy = (serviceName) => {
	const service = services[serviceName]

	if(service && fs.existsSync(service.path)) {
		const currentReleaseLink = path.join(service.path, 'current')
		const releasePath = path.join(service.path, generateReleaseName())

		// Go to the service root folder.
		process.chdir(service.path)

		// Clone the new release.
		exec(`git clone ${service.repo} ${releasePath}`)

		// Step into the new release.
		process.chdir(releasePath)

		// Execute each of the service's deploy commands.
		service.commands.forEach(exec)

		// Symlink to the new release to activate it.
		exec(`ln -sfn ${releasePath} ${currentReleaseLink}`)

		// Restart the PM2 if it exists.
		if (service.pm2) {
			exec(`pm2 restart ${serviceName}`)
		}
	}
}

module.exports = deploy
