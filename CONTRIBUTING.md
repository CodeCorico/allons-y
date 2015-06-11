# Contributing to Allons-y! project

We'd love for you to contribute to our source code and to make this project even better and fun than it is
today! Here are the guidelines we'd like you to follow:

 - [Code of Conduct](#coc)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Coding Rules](#rules)
 - [Commit Message Guidelines](#commit)
 - [Releases](#releases)
 - [Further Info](#info)

## <a name="coc"></a> Code of Conduct
As contributors and maintainers of the project, we pledge to respect everyone who contributes by posting issues, submitting pull requests, providing feedback in comments, and any other activities.

Communication through any of project's channels (GitHub, IRC, mailing lists, Google+, Twitter, etc.) must be constructive and never resort to personal attacks, trolling, public or private harrassment, insults, or other unprofessional conduct.

We promise to extend courtesy and respect to everyone involved in this project regardless of gender, gender identity, sexual orientation, disability, age, race, ethnicity, religion, or level of experience. We expect anyone contributing to the project to do the same.

If any member of the community violates this code of conduct, the maintainers of the project may take action, removing issues, comments, and PRs or blocking accounts as deemed appropriate.

If you are subject to or witness unacceptable behavior, or have any other concerns, please contact us.

## <a name="question"></a> Got a Question or Problem?

If you have questions about how to use Allons-y!, please direct these to hello@codecorico.com.

## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the wiki, you can help us by
submitting an issue to the [GitHub Repository](https://github.com/CodeCorico/allons-y/issues). Even better you can submit a Pull Request with a fix.

**Please see the Submission Guidelines below**.

## <a name="feature"></a> Want a Feature?
You can request a new feature by submitting an issue to the [GitHub Repository](https://github.com/CodeCorico/allons-y). If you
would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed first with us so that we can better coordinate our efforts, prevent duplication of work, and help you to craft the change so that it is successfully accepted into the project.
* **Small Changes** can be crafted and submitted to the [GitHub Repository](https://github.com/CodeCorico/allons-y) as a Pull Request.

A new issue create a discussion thread. Other contributors can advise and contribute to your ideas. Please search whether the subject does not already exists on the [opened issues](https://github.com/CodeCorico/allons-y/issues?q=is%3Aopen+is%3Aissue) before that to prevent duplicates issues.

### Write a _How to reproduce_ for a bug

We have a _Bug issue pattern_ that all contributor should use. When you create a new bug issue, use this format to explain your unexpected behavior:

```
**Bug**
<BLANK LINE>
The description of your bug
<BLANK LINE>
**How to reproduce**
<BLANK LINE>
How to reproduce your bug, step by step.
More information you add, the faster the bug will be
understood by other agents and corrected.
```

### Write a User Story for a new feature

To help us understand what is your needs you have to use the [User Story](http://en.wikipedia.org/wiki/User_story) pattern.

In Allons-y!, a feature needs to be in a _user story_ format that represent user's real expectations. When you create a new issue, use this format to explain your request:

```
As a <role> I want <goal/desire> so that <benefit>
```

Describe with details your role, like _daily user_ or _windows developer_ and don't forget the benefit. You can add other informations to be more understanding. Optionnaly you can add a list of **technical criteria** with actions to do.

## <a name="submit"></a> Submission Guidelines

### Submitting an Issue
Before you submit your issue please search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new
features, by not reporting duplicate issues. Providing the following information will increase the
chances of your issue being dealt with quickly:

* **Overview of the issue** - if an error is being thrown a non-minified stack trace helps
* **Motivation for or Use Case** - explain why this is a bug for you
* **Version(s)** - is it a regression?
* **Browsers and Operating System** - is this a problem with all browsers or only IE8?
* **Reproduce the error** - provide a live example (using [Plunker](http://plnkr.co) or [JSFiddle](http://jsfiddle.net)) or a unambiguous set of steps.
* **Related issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be causing the problem (line of code or commit)

**If you get help, help others. Good karma rulez!**

### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search [GitHub pulls](https://github.com/CodeCorico/allons-y/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch, **including appropriate test cases**.
* Follow the [Coding Rules](#rules).
* Commit your changes using a descriptive commit message that follows the
  [commit message conventions](#commit-message-format).

     ```shell
     git commit -a
     ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `allons-y:master`.
* If we suggest changes then
  * Make the required updates.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the master branch:

    ```shell
    git checkout master -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your master with the latest upstream version:

    ```shell
    git pull --ff upstream master
    ```

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more contributors.

## <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
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
* **rules**: Modifications on rules
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

###Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes"
The body should include the motivation for the change and contrast this with previous behavior.

###Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

## <a name="releases"></a> Releases

Only the lead contribution team can publish a new version. To do that, it requires that the milestone is completely finished ([Milestones](https://github.com/CodeCorico/allons-y/issues/milestones?state=open)).

Publish the new version:
* Pull the last version of `master` branch
* Update CHANGELOG.md file with the actual date and links of the milestone
* Create commit with its last changes named: `Version [new version number]`
* Create a new tag on this commit named `[new version number]`
* Push this branch to `allons-y:master`

## <a name="infos"></a> Further Info

Inspired file from https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md
