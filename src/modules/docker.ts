'use strict'

import {execSync} from "child_process"
import * as envfile from "envfile"
import * as fs from "fs"

module.exports = class Docker {

	/**
	 * Execute docker compose command.
	 *
	 * @param debug
	 *   If true the command will be outputted but not executed.
	 * @param env
	 *   The environment file to use.
	 * @param root
	 *   The root path to execute the command in.
	 * @param compose
	 *   The composer binary.
	 * @param inputCmd
	 *   The commands to parse to docker compose.
	 */
	exec(debug: boolean, env: string, root: string, compose: string, inputCmd: string) {
		let cmd = compose + ' --env-file ' + env + ' ';

		// Get yml files from .env file.
		let content = fs.readFileSync(root + '/' + env);
		let json = envfile.parse(content.toString());
		if (!json.hasOwnProperty('COMPOSE_FILES')) {
			cmd += '-f docker-compose.server.yml '
		}
		else {
			let files = json.COMPOSE_FILES.split(",");
			files.forEach(function (element: string) {
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
				execSync(cmd, {encoding: 'utf8', cwd: root, stdio: 'inherit'});
			} catch (err) {
				if (err instanceof Error) {
					console.error(err.message);
				}
				return null;
			}
		}
	}
}
