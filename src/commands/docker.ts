'use strict';

import Docker from '../modules/docker';
import Utils from '../modules/utils';

exports.command = '*'
exports.description = 'Docker-compose server site using .env to detect setup'

exports.handler = function (argv: { [x: string]: any; base: string; debug: any; docker: any; }) {
  const utils = new Utils();
  const docker = new Docker();
  const env = argv['env-file'];

  // Test env file exists.
  if (!utils.isFile(argv.base + '/' + env)) {
    console.error('The env file not found!');
    return;
  }

  // Hack to parse the commands that should be sendt to docker.
  let options = process.argv.splice(2);

  const composeArguments = [];
  for (let i = 0; i < options.length; i++) {
    switch (options[i]) {
      case "--debug":
      case "--dump-info":
        continue;

      case "--env-file":
      case "--base":
      case "--docker":
        // Jump over the argument to these parameteres
        i++
        continue;

      default:
        composeArguments.push(options[i]);
    }
  }

  if (argv['dumpInfo']) {
    docker.info(argv.debug, env, argv.base);
  }
  else {
    docker.exec(argv.debug, env, argv.base, argv.docker, composeArguments)
  }
}
