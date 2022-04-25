'use strict';

const Docker = require('../modules/docker');
const Utils = require('../modules/utils');

exports.command = '*'
exports.description = 'Docker-compose server site using .env to detect setup'

exports.handler = function (argv) {
  const utils = new Utils();
  const docker = new Docker();
  const env = argv['env-file'];

  // Test env file exists.
  if (!utils.isFile(env)) {
    console.error('The env file not found!');
    return;
  }

  // Hack to parse the commands that should be sendt to docker.
  let options = process.argv.splice(2);
  for (var i = 0; i < options.length; i++) {
    switch (options[i]) {
      case "--debug":
        options.splice(i, 1);
        break;

      case "--env-file":
        options.splice(i, 2);
        break;
    }
  }

  docker.exec(argv.debug, env, options.join(' '))
}
