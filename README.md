<p align="center"><img src="http://codecorico.com/allons-y-logo.png" height="100" /></p>

# Allons-y

[![Join the chat at https://gitter.im/CodeCorico/allons-y](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CodeCorico/allons-y?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/allons-y.svg)](https://badge.fury.io/js/allons-y)
[![Stories in Ready](https://badge.waffle.io/CodeCorico/allons-y.png?label=ready&title=Ready)](https://waffle.io/CodeCorico/allons-y)

Allons-y is a [Package by feature](http://stackoverflow.com/questions/11733267/is-package-by-feature-approach-good) architect engine.

## Install

You can easily architect your project by installing the `allons-y` module:
```
npm install allons-y --save
```

## What is Allons-y?

Thanks to NPM and its community, we have access to thousands of varied functionality for our projects. Infortunatly, we have to re-interface them for each new project.
In the other hand, we have access to some frameworks (like [Sails](http://sailsjs.com/) or [Loop Back](https://loopback.io)) but they comes with a fixed list of modules (like [Express](https://expressjs.com)) that can't be avoided.

[Allons-y](https://github.com/CodeCorico/allons-y) is not a framework. It's a system that allows the developers to architect their projects in a [Package by feature](http://stackoverflow.com/questions/11733267/is-package-by-feature-approach-good) way. With it, you can link your modules wth each other ([read the principles](https://github.com/CodeCorico/allons-y/blob/master/docs/principles.md)).

They are [many modules](https://github.com/CodeCorico/allons-y/blob/master/docs/allons-y-modules.md) that you can use inside your projects to include popular modules like [Express](https://expressjs.com), [Gulp](http://gulpjs.com) and more. You can easily [create your own](https://github.com/CodeCorico/allons-y/blob/master/docs/create-your-own.md) or create private modules that can be included in the Allons-y logic.

## Documentation

* [Principles](https://github.com/CodeCorico/allons-y/blob/master/docs/principles.md)
* [Architecture](https://github.com/CodeCorico/allons-y/blob/master/docs/architecture.md)
* [Live commands](https://github.com/CodeCorico/allons-y/blob/master/docs/live-commands.md)
* [Processes](https://github.com/CodeCorico/allons-y/blob/master/docs/processes.md)
* [CLI](https://github.com/CodeCorico/allons-y/blob/master/docs/cli.md)
* [Logs](https://github.com/CodeCorico/allons-y/blob/master/docs/logs.md)
* [Environments](https://github.com/CodeCorico/allons-y/blob/master/docs/environments.md)
* [More allons-y modules](https://github.com/CodeCorico/allons-y/blob/master/docs/allons-y-modules.md)
* [Create your own open source/private modules](https://github.com/CodeCorico/allons-y/blob/master/docs/create-your-own.md)

## API

* [$allonsy](https://github.com/CodeCorico/allons-y/blob/master/docs/api-allonsy.md)
* [$glob](https://github.com/CodeCorico/allons-y/blob/master/docs/api-glob.md)
* [$processIndex](https://github.com/CodeCorico/allons-y/blob/master/docs/api-processIndex.md)
* [$commander](https://github.com/CodeCorico/allons-y/blob/master/docs/api-commander.md)

## Want to help?

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [guidelines for contributing](CONTRIBUTING.md) and then check out one of [our issues](https://github.com/CodeCorico/allons-y/issues).
