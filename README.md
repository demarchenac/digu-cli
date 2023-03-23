oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g digu-cli
$ digu-cli COMMAND
running command...
$ digu-cli (--version)
digu-cli/1.0.1 darwin-arm64 node-v18.15.0
$ digu-cli --help [COMMAND]
USAGE
  $ digu-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`digu-cli help [COMMANDS]`](#digu-cli-help-commands)
* [`digu-cli plugins`](#digu-cli-plugins)
* [`digu-cli plugins:install PLUGIN...`](#digu-cli-pluginsinstall-plugin)
* [`digu-cli plugins:inspect PLUGIN...`](#digu-cli-pluginsinspect-plugin)
* [`digu-cli plugins:install PLUGIN...`](#digu-cli-pluginsinstall-plugin-1)
* [`digu-cli plugins:link PLUGIN`](#digu-cli-pluginslink-plugin)
* [`digu-cli plugins:uninstall PLUGIN...`](#digu-cli-pluginsuninstall-plugin)
* [`digu-cli plugins:uninstall PLUGIN...`](#digu-cli-pluginsuninstall-plugin-1)
* [`digu-cli plugins:uninstall PLUGIN...`](#digu-cli-pluginsuninstall-plugin-2)
* [`digu-cli plugins update`](#digu-cli-plugins-update)

## `digu-cli help [COMMANDS]`

Display help for digu-cli.

```
USAGE
  $ digu-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for digu-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.8/src/commands/help.ts)_

## `digu-cli plugins`

List installed plugins.

```
USAGE
  $ digu-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ digu-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.3/src/commands/plugins/index.ts)_

## `digu-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ digu-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ digu-cli plugins add

EXAMPLES
  $ digu-cli plugins:install myplugin 

  $ digu-cli plugins:install https://github.com/someuser/someplugin

  $ digu-cli plugins:install someuser/someplugin
```

## `digu-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ digu-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ digu-cli plugins:inspect myplugin
```

## `digu-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ digu-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ digu-cli plugins add

EXAMPLES
  $ digu-cli plugins:install myplugin 

  $ digu-cli plugins:install https://github.com/someuser/someplugin

  $ digu-cli plugins:install someuser/someplugin
```

## `digu-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ digu-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ digu-cli plugins:link myplugin
```

## `digu-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ digu-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ digu-cli plugins unlink
  $ digu-cli plugins remove
```

## `digu-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ digu-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ digu-cli plugins unlink
  $ digu-cli plugins remove
```

## `digu-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ digu-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ digu-cli plugins unlink
  $ digu-cli plugins remove
```

## `digu-cli plugins update`

Update installed plugins.

```
USAGE
  $ digu-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
