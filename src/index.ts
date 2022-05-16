#!/usr/bin/env node

'use strict';

import yargs from "yargs";
import {hideBin} from "yargs/helpers"

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
        },
        'root': {
            description: 'The directory (root) to find the environment file',
            default: '.',
            type: 'string'
        },
        'compose': {
            description: 'Location of docker-compose executable',
            default: '/usr/local/bin/docker-compose',
            type: 'string'
        },
        'dump-info': {
            description: 'Output information about containers as JSON',
            default: false,
            type: 'boolean'
        }
    })
    .demandCommand()
    .strictCommands()
    .help(false)
    .argv
