const fs = require('fs')
const path = require('path')

const logger = console

const exec = (cmd) => {
	logger.log(require('child_process').execSync(cmd).toString())
}

const deploy = (service) => {
	if(service && fs.existsSync(service.path)) {
		const currentReleasePath = 'current'
		const releasePath = path.join(
			service.path,
			(new Date()).getTime().toString()
		)

		// Go to the service root folder.
		process.chdir(service.path)

		// Clone the new release.
		exec(`git clone ${service.repo} ${releasePath}`)

		// Step into the new release.
		process.chdir(releasePath)

		// Execute each of the service's deploy commands.
		service.commands.forEach(exec)

		// Symlink to the new release to activate it.
		exec(`ln -s ${releasePath} ${currentReleasePath}`)
	}
}

module.exports = deploy
