#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')

const argv = yargs(hideBin(process.argv))
  .commandDir('commands')
  .options({
    'env-file': {
      description: 'Environment file with setup description',
      default: '.env.docker.local',
      type: 'string'
    },
    debug: {
      description: 'Output data to console and do not post to API',
      default: false,
      type: 'boolean'
    }
  })
  .demandCommand()
  .strictCommands()
  .help()
  .argv
