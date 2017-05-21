# Allons-y Architecture

## Install

When you install one of the allons-y modules, the main allons-y module adds automatically to your project:
- The `allons-y.js` file.
- The `start` and `stop` scripts to your `package.json` file.

With the `allons-y.js` file, you are able to call any command with `node allons-y [my command] [my args, ...]` ([read more on the CLI](https://github.com/CodeCorico/allons-y/blob/master/docs/cli.md)).

With the scripts, you can start and stop the Allons-y processes of your project (and those installed in your node_modules).

## Linked features

In Allons-y, we use specific naming files to inject code when an action is called. For example, if you have a file named `*-allons-y-start.js` in one of your features, it will be automatically used when you'll start `npm start`. They are many file names availables, depends on wich allons-y modules you are using.

By default, features are located in these directories:
- Each directory in your project `features` folder (like `features/my-feature/`).
- Each directory in an `allons-y-*` module inside your `node_modules` folder.

## Find files in features

In your modules, you have access to the `$allonsy` [injected dependency](#dependencies-injection). You can use its `$allonsy.findInFeatures()` (or `$allonsy.findInFeaturesSync()`) method to get every file available in features. When you start `npm start`, Allons-y uses `$allonsy.findInFeaturesSync('*-allons-y-start.js')` to get every process to start.

This system is the first step to make your features totally independent. [read the $allonsy API](https://github.com/CodeCorico/allons-y/blob/master/docs/api-allonsy.md) for more useful methods.

## Add more feature directory patterns

Any node module started with "allons-y-" is used by Allons-y but you can add you own patterns.
Simply add the file `.allons-y-paths` in the root directory of your project and write each pattern per line:
```
./node_modules/myproject-module-*
../direct-another-project
/etc/other-module
```

## Dependencies injection

Allons-y is using the Dependencies injection pattern in every file required in your project. Your modules are able to use some variables like `$allonsy` or `$glob` for example:
```javascript
// myfeature-allons-y-start.js

module.exports = function($allonsy) {
  $allonsy.log('file called!');
}
```

You can add your own dependecies with the `DependencyInjection` global variable. It uses the [MVW Injection](https://github.com/XavierBoubert/mvw-injection) module with the MVC pattern.
