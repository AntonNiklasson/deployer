const execSync = require('child_process').execSync

const logger = console

const exec = (cmd) => {
	const output = execSync(cmd)

	logger.log(cmd)
	logger.log(output.toString())
}

module.exports = exec
