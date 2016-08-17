# Allons-y

[![Join the chat at https://gitter.im/CodeCorico/allons-y](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CodeCorico/allons-y?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Issue Stats](http://issuestats.com/github/codecorico/allons-y/badge/issue)](http://issuestats.com/github/codecorico/allons-y)
[![Issue Stats](http://issuestats.com/github/codecorico/allons-y/badge/pr)](http://issuestats.com/github/codecorico/allons-y)

Allons-y is a webapps platform installer that comes from a Sci-Fi movie.

[![Microsoft: Productivity Future Vision](http://img.youtube.com/vi/hBNH8qub_vI/0.jpg)](http://www.youtube.com/watch?v=hBNH8qub_vI)

## Create an Allons-y project

Create your project folder and symply include _allons-y_:
```
mkdir my-project
cd my-project
npm install allons-y
```

Now you can start it with ```npm start```.

```node allons-y env```
```*-env.json```
```{
  fork: true,
  forkCount: 4,
  module: [function() {}]
}```
```{
  spawn: true,
  spawnCommand: 'node',
  spawnArgs: ['node_modules/gulp/bin/gulp']
}```

# ------- OLD DOC -------

## Create a new platform

Allons-y uses a wizard form to configure your platreform and install its architecture.
Create an empty directory then instantiate Allons-y:
```
mkdir myProject
cd myProject
allons-y init
```

After that, your platform is stand-alone, you do not need the ```allons-y``` command to support it.

## Setup your environment(s)

Your platform architecture comes with the [dotenv](https://github.com/bkeepers/dotenv) module. Use the following wizard to help you configure your environment:
```
allons-y env
```

Each configuration comes from Allons-y but you can add you own by adding ```*-env.json``` files in your ```/features``` directory. E.g.:
```features/users/users-env.json``` will be used in the env configuration.
Use this format in your json file:
```json
{
  "env": [{
    "type": "confirm",
    "name": "AVATARS",
    "message": "Use avatars?",
    "default": true
  }]
}
```

```env``` is an array containing your questions. See the [Inquirer](https://github.com/SBoudrias/Inquirer.js) documentation to configure your questions.

The ```.env``` file configuration can't be indexed in your repo, it depends on your environment. You can easily configure other environments with ```allons-y env``` or with a copy of your ```.env``` file.

## Update a platform

Allons-y evolves with time. Its architecture and bugs are frequently fixed. If you want to update your project with the latest version, use:
```
cd myProject
allons-y update
```

You can add the following arguments:
- ```--no-npm``` to avoid the call of ```npm update```
- ```--force``` to force the update even if the version is already up to date

## Developer rules

To contribute to the project, you have to follow rules explained in the [Contributing documentation](CONTRIBUTING.md).
