# Allons-y! - Changelog

Versions details history. For each version you can find:
* Name an version number
* Date published
* Link to the release tag
* Link to the release branch
* All of the modifications details

<a name="0.2.1"></a>
# 0.2.1 (2015-06-25)

[Release 0.2.1](https://github.com/CodeCorico/allons-y/releases/tag/0.2.1) - [Branch release/0.2.1](https://github.com/CodeCorico/allons-y/tree/0.2.1)

### Hotixes

- **Cli**
  - Fix copy of ```common-async-gulpfile.js``` and ```common-events-manager-gulpfile.js``` to destination plateform.

<a name="0.2.0"></a>
# 0.2.0 (2015-06-23)

[Release 0.2.0](https://github.com/CodeCorico/allons-y/releases/tag/0.2.0) - [Branch release/0.2.0](https://github.com/CodeCorico/allons-y/tree/0.2.0)

### Breaking changes

- **Start/Stop**
  - ```npm stop``` stops the active plateform instance.
  - ```npm start``` kills the active plateform instance before restart it. It calls ```npm install``` then ```node evolve``` between stoping and starting the plateform.
- **Abstract service**
  - Add arguments support in ```teardown``` and ```beforeTeardown``` events.
- **Databases**
  - Add support for SQL databases (with Sequelize).
  - Add support for multiples MongoDB and SQL connections.
- **Bootstrap**
  - Update for new Plumes 0.2.0 behaviors.
  - Update for new Ractive-Require 0.2.4 behaviors.

### Fixes

- **Unix**
  - Convert files to Unix endline for ```npm publish``` to support ```allons-y``` command on unix system.
- **Gulp watcher**
  - Fix the models files that are not compiled in ```/public``` automatically.
- **allons-y init**
  - Fix projects name that cann't have a _-_ character.
- **Evolve**
  - Fix first version template name ```version-0.0.1.js``` to ```version-0.1.0.js```.
- **Conventions**
  - Remove the legacy #quality pattern.
  - Define the release publishing.

<a name="0.1.3"></a>
# 0.1.3 (2015-06-11)

[Release 0.1.3](https://github.com/CodeCorico/allons-y/releases/tag/0.1.3) - [Branch release/0.1.3](https://github.com/CodeCorico/allons-y/tree/0.1.3)

### Breaking changes

- **Configurations**
  - Rename .gitignore resource to ignore to prevent npm install modification

<a name="0.1.2"></a>
# 0.1.2 (2015-06-11)

[Release 0.1.2](https://github.com/CodeCorico/allons-y/releases/tag/0.1.2) - [Branch release/0.1.2](https://github.com/CodeCorico/allons-y/tree/0.1.2)

### Breaking changes

- **Allons-y!**
  - Fix bin install (again, my bad)

<a name="0.1.1"></a>
# 0.1.1 (2015-06-11)

[Release 0.1.1](https://github.com/CodeCorico/allons-y/releases/tag/0.1.1) - [Branch release/0.1.1](https://github.com/CodeCorico/allons-y/tree/0.1.1)

### Breaking changes

- **Allons-y!**
  - Fix bin install

<a name="0.1.0"></a>
# 0.1.0 (2015-06-11)

[Release 0.1.0](https://github.com/CodeCorico/allons-y/releases/tag/0.1.0) - [Branch release/0.1.1](https://github.com/CodeCorico/allons-y/tree/0.1.0)

### Breaking changes

- **Allons-y!**
  - Migration from the internal private project
