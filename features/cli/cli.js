'use strict';

var utils = require('./cli-utils'),
    program = require('commander'),
    Plateform = require('./cli-plateform');

program
  .version(utils.package.name + ' ' + utils.package.version, '-v, --version')
  .usage('[options]')
  .option('-f, --force', 'Force the creation/update of the platform')
  .option('-n, --no-npm', 'Create/update the platform without use npm')
  .option('create', 'Create a new Allons-y! platform')
  .option('update', 'Update a platform with the last version of Allons-y!')
  .option('config, configure', 'Configure the packages of an existing Allons-y! platform')
  .option('env', 'Configure your local platform environment')
  .parse(process.argv);

if (program.create) {
  return Plateform.create(program.force, program.npm);
}

if (program.update) {
  return Plateform.update(program.force, program.npm);
}

if (program.config || program.configure) {
  return Plateform.configure();
}

if (program.env) {
  return Plateform.env();
}

program.help();
