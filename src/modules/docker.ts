'use strict'

import {execFileSync} from "child_process"
import * as envfile from "envfile"
import * as fs from "fs"
import * as yaml from "js-yaml"
import Utils from "./utils";

/**
 * ComposerYAML interface.
 *
 * Structure of the data read from docker compose yaml files.
 */
interface ComposerYAML {
	services: {
		[index: string]: {
			image: string,
			ports: string[],
			build: string,
		}
	}
}

/**
 * Container output information definition.
 */
interface Container {
	name: string,
	source: string,
	image: string,
	version: string
	ports: string[],
}

export default class Docker {

	/**
	 * Execute docker compose command.
	 *
	 * @param debug
	 *   If true the command will be outputted but not executed.
	 * @param env
	 *   The environment file to use.
	 * @param base
	 *   The base path to execute the command in.
	 * @param docker
	 *   The docker binary.
	 * @param composeArguments
	 *   The commands to pass to docker compose.
	 */
	public exec(debug: boolean, env: string, base: string, docker: string, composeArguments: string[])
	{
		const args = [
			'compose',
			'--env-file', env
		]

		// Get yml files from .env file.
		let content = fs.readFileSync(base + '/' + env);
		let json = envfile.parse(content.toString());
		if (!json.hasOwnProperty('COMPOSE_FILES')) {
			json.COMPOSE_FILES = 'docker-compose.server.yml'
		}

		let files = json.COMPOSE_FILES.split(",");
		files.forEach(function (element: string) {
			args.push('--file')
			args.push(element)
		});

		for (var a of composeArguments) {
			args.push(a)
		}

		if (debug) {
			const utils = new Utils()
			console.log([docker, ...args].map(s => utils.shellEscape(s)).join(' '));
		}
		else {
			try {
				execFileSync(docker, args, {encoding: 'utf8', cwd: base, stdio: 'inherit'});
			} catch (err) {
				if (err instanceof Error) {
					console.error(err.message);
				}
				return null;
			}
		}
	}

	/**
	 * Get docker image information from yaml composer files.
	 *
	 * Use the .env file detected to find composer files
	 * and parse services.
	 *
	 * @param debug
	 * @param env
	 * @param base
	 */
	public info(debug: boolean, env: string, base: string)
	{
		let files: string[] = [ 'docker-compose.server.yml' ];
		let content = fs.readFileSync(base + '/' + env);
		let json = envfile.parse(content.toString());
		if (json.hasOwnProperty('COMPOSE_FILES')) {
			files = json.COMPOSE_FILES.split(",");
		}

		if (debug) {
			console.log('Base: ', base)
			console.log('Env-file: ', env);
			console.log('Files: ', files);
		}

		let containers: Container[] = [];
		let that: Docker = this;
		files.forEach(function (element: string) {
			containers = containers.concat(that.parse(element, base));
		}, that);

		console.log(JSON.stringify(containers));
	}

	/**
	 * Parse basic information about images based on composer yaml file.
	 *
	 * @param file
	 *   Docker compose yaml file to parse
	 * @param base
	 *   The base directory where the yaml file is located.
	 *
	 * @private
	 */
	private parse(file: string, base: string): Container[]
	{
		let fileContents = fs.readFileSync(base + '/' + file, 'utf8');
		let data = yaml.load(fileContents) as ComposerYAML;
		let containers: Container[] = [];

		for (let service of Object.keys(data.services)) {
			let container: Container = {
				'name': service,
				'source': 'unknown',
				'image': 'unknown',
				'version': 'unknown',
				'ports': []
			}

			if (data.services[service].hasOwnProperty('image')) {
				let image = data.services[service].image.split(':');
				container.source = 'hub';
				container.image = image[0];
				container.version = image[1];
				container.ports = data.services[service].hasOwnProperty('ports') ? data.services[service].ports : [];

				// Only add information to output if the service has an image defined else its simple overrides.
				containers.push(container);
			}

			// Check if this is a build.
			if (data.services[service].hasOwnProperty('build')) {
				container.source = 'build';
				container.ports = data.services[service].hasOwnProperty('ports') ? data.services[service].ports : [];

				containers.push(container);
			}

		}

		return containers;
	}
}
