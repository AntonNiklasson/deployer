const exec = require('child_process').execSync
const fs = require('fs')
const path = require('path')

const logger = console

const deploy = (service) => {
	if(service && fs.existsSync(service.path)) {
		const currentReleasePath = 'current'
		const releasePath = (new Date()).getTime().toString()

		// Go to the service root folder.
		logger.log(`cd ${service.path}`)
		process.chdir(service.path)

		// Clone the new release.
		logger.log(`git clone ${service.repo} ${releasePath}`)
		logger.log(exec(`git clone ${service.repo} ${releasePath}`))

		// Step into the new release.
		logger.log(`cd ${path.join(service.path, releasePath.toString())}`)
		process.chdir(path.join(service.path, releasePath))

		// Execute each of the service's deploy commands.
		service.commands.forEach(cmd => logger.log(exec(cmd)))

		// Step out of the release folder.
		process.chdir('..')

		// Activate the new release.
		logger.log(exec(`ln -s ${releasePath} ${currentReleasePath}`))
	}
}

module.exports = deploy
