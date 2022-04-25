'use strict'

const {execSync} = require('child_process');
const envfile = require("envfile");
const fs = require('fs');

module.exports = class Docker {

	exec(debug, env, inputCmd) {
		let cmd = 'docker-compose --env-file ' + env + ' ';

		// Get yml files from .env file.
		let content = fs.readFileSync(env);
		let json = envfile.parse(content.toString());
		if (!json.hasOwnProperty('COMPOSE_FILES')) {
			cmd += '-f docker-compose.server.yml '
		}
		else {
			let files = json.COMPOSE_FILES.split(",");
			files.forEach(function (element) {
				cmd += '-f ' + element + ' ';
			});
		}

		// Add command
		cmd += inputCmd;

		if (debug) {
			console.log(cmd);
		}
		else {
			try {
				execSync(cmd, {encoding: 'utf8', stdio: 'inherit'});
			} catch (exception) {
				return null;
			}
		}
	}
}
