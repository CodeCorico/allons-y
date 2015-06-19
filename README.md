# Allons-y!

[![Join the chat at https://gitter.im/CodeCorico/allons-y](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CodeCorico/allons-y?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Allons-y! is a webapps plateform installer that come from a S.F. movie.

[![Microsoft: Productivity Future Vision](http://img.youtube.com/vi/hBNH8qub_vI/0.jpg)](http://www.youtube.com/watch?v=hBNH8qub_vI)

## Installation

Include the Allons-y! app globally with:
```
npm install -g allons-y
```

For quality version (similar to beta):
```
npm install -g allons-y#quality
```

## Create a new plateform

Allons-y! uses a wizard form to configure your platreform and install its architecture.
Create an empty directory then instantiate Allons-y!:
```
mkdir myProject
cd myProject
allons-y init
```

After that, your plateform is standalone, you do not need the ```allons-y``` command to support it.

## Setup your environment(s)

Your plateform architeture comes with the ```dotenv``` module. Use the following wizard to help you configure your environment:
```
allons-y env
```

Each configuration comes from Alolons-y! but you can add you own by adding *-env.json files in your /features. E.g:
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

The ```.env``` file configuration can't be indexed in your repo, it's up to your environment. You can easily configurate other environments with ```allons-y env``` or with a copy of your ```.env``` file.

## Update a plateform

Allons-y! evolves with time. Its architecture and bugs are frequently fixed. If you want to update your project with the last version, use:
```
cd myProject
allons-y update
```

You can pass these attributes:
- ```--no-npm``` to avoid the call of ```npm update```
- ```--force``` to force the update even if the version is already up to date.

## Developer rules

To contribute to the project, you have to follow rules explained in the [Contributing documentation](CONTRIBUTING.md).
