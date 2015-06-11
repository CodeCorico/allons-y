# Contributing to {{title}} project

We'd love for you to contribute to our source code and to make this project even better and fun than it is
today! Here are the guidelines We'd like you to follow:

 - [Code of Conduct](#coc)
 - [Coding Rules](#rules)
 - [Coding style](#style)
 - [Commit Message Guidelines](#commit)
 - [Releases](#releases)
 - [Further Info](#info)

## <a name="coc"></a> Code of Conduct
As contributors and maintainers of the project, we pledge to respect everyone who contributes by posting issues, submitting pull requests, providing feedback in comments, and any other activities.

Communication through any of project's channels (GitHub, IRC, mailing lists, Google+, Twitter, etc.) must be constructive and never resort to personal attacks, trolling, public or private harassment, insults, or other unprofessional conduct.

We promise to extend courtesy and respect to everyone involved in this project regardless of gender, gender identity, sexual orientation, disability, age, race, ethnicity, religion, or level of experience. We expect anyone contributing to the project to do the same.

If any member of the community violates this code of conduct, the maintainers of the project may take action, removing issues, comments, and PRs or blocking accounts as deemed appropriate.

If you are subject to or witness unacceptable behavior, or have any other concerns, please contact us.

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more contributors.
* Unit tests has to be successful.

## <a name="style"></a> Coding style
The project contain two files to link with your favorite editor:

* [.jshintrc](.jshintrc): Is the JsHint rules.
* [.jscsrc](.jscsrc): Is the coding style rules based on the _airbnb_ preset with little adjustments.

Use theses files to follow our coding style rules in the project.

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how out git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on github as well as in various git tools.

### Type
Must be one of the following:

* **chore**: Modifications on project details (like readme files)
* **feat**: A new feature
* **fix**: A bug fix
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **perf**: A code change that improves performance

### Scope
The scope could be anything specifying place of the commit change. For example `feature`,
`component`, `class`, etc...

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes"
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer is the place to reference GitHub issues, tasks, etc.

## <a name="releases"></a> Releases
Only the lead contribution team can publish a new version. To do that, it requires that the milestone is completely finished.

Publish the new version:
* Pull the last version of `quality` branch
* Merge `quality` to `master` branch
* Create a new tag on this commit named `[new version number]` (format: 0.0.0)
* Push this branch to `{{name}}:master`
* Push the new tag release with ```git push --tags```

## <a name="infos"></a> Further Info

Inspired file from https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md
