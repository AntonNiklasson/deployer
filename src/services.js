module.exports = {
	"deployer": {
		secret: "e143d5f471287e4288b356a7870fb8acdc61adb242a257d84fd8769ccfbc5180",
		"path": "/var/www/deployer.antonniklasson.se",
		"repo": "git@github.com:AntonNiklasson/deployer.git",
		"branch": "master",
		"pm2": true,
		"commands": [
			"npm install"
		]
	},
	"bowtie-api": {
		secret: "e143d5f471287e4288b356a7870fb8acdc61adb242a257d84fd8769ccfbc5180",
		path: "/var/www/api-node.mybowtie.co",
		repo: "git@github.com:AntonNiklasson/bowtie-api.git",
		"branch": "master",
		"pm2": true,
		commands: [
			"npm install"
		]
	}
}
