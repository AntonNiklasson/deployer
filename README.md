# Deployer

A simple Express application that solves "push to deploy".

Add a webhook to  **http://<domain/IP>/deploy/<service>** inside the repository's settings on GitHub.

This is what a service might look like:

```javascript
module.exports = {
	"<service-name>": {
		secret: "<the-secret-that-is-defined-in-repo-settings>",
		"path": "<folder-on-the-server>",
		"repo": "<repo-ssh-url>",
		"branch": "master",
		"pm2": true,
		"commands": [
			"npm test",
			"npm install"
		]
	}
}
```
