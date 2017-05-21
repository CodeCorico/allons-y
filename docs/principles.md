# Allons-y Principles

An Allons-y compatible module is splitted in features. A feature is scoped in its directory and is completely independent. It may depend on other features but should not crash the project if some dependencies are missing.

Allons-y automatically finds all the features of the project as well as those installed in the node_modules. It binds them together through its [architect system](https://github.com/CodeCorico/allons-y/blob/master/docs/architecture.md). A feature is available through events, specific file names, or dependencies injection.

A project built on Allons-y doesn't use the environment variables for defining usual environments, like DEV, STAGING, PRODUCTION, etc. They are used to activate/deactivate features and to manage them. It's possible to combine several types of applications, such as API servers, SPA, Cordova apps within the same project. Simply activate the features according to the machine the project is being executed. This allows to share the code between all these apps easily.
