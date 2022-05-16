'use strict';

import Docker from '../modules/docker';
import Utils from '../modules/utils';

exports.command = '*'
exports.description = 'Docker-compose server site using .env to detect setup'

exports.handler = function (argv: { [x: string]: any; root: string; debug: any; compose: any; }) {
  const utils = new Utils();
  const docker = new Docker();
  const env = argv['env-file'];

  // Test env file exists.
  if (!utils.isFile(argv.root + '/' + env)) {
    console.error('The env file not found!');
    return;
  }

  // Hack to parse the commands that should be sendt to docker.
  let options = process.argv.splice(2);
  let cmd = '';

  for (let i = 0; i < options.length; i++) {
    switch (options[i]) {
      case "--debug":
      case "--dump-info":
        continue;

      case "--env-file":
      case "--root":
      case "--compose":
        // Jump over the argument to these parameteres
        i++
        continue;

      default:
        cmd += ' ' + options[i];
    }
  }

  if (argv['dumpInfo']) {
    docker.info(argv.debug, env, argv.root);
  }
  else {
    docker.exec(argv.debug, env, argv.root, argv.compose, cmd)
  }
}
