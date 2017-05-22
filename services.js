module.exports = [
	{
		id: "deployer",
		secret: "e143d5f471287e4288b356a7870fb8acdc61adb242a257d84fd8769ccfbc5180",
		path: "/var/www/deployer.antonniklasson.se",
		repo: "git@github.com:AntonNiklasson/deployer.git",
		branch: "master",
		commands: [
			"npm install"
		]
	},
	{
		id: "bowtie-api",
		secret: "e143d5f471287e4288b356a7870fb8acdc61adb242a257d84fd8769ccfbc5180",
		path: "/var/www/api-node.mybowtie.co",
		repo: "git@github.com:AntonNiklasson/bowtie-api.git",
		branch: "master",
		commands: [
			"npm install"
		]
	},
	{
		id: "cv",
		secret: "69f2afc2390cec954f7c208b07212d39",
		path: "/var/www/cv.antonniklasson.se",
		repo: "git@github.com:AntonNiklasson/cv.antonniklasson.se.git",
		branch: "master",
		commands: [
			"npm install",
			"gulp"
		]
	}
]
