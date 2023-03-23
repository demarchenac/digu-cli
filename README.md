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
digu-cli/1.0.13 darwin-arm64 node-v18.15.0
$ digu-cli --help [COMMAND]
USAGE
  $ digu-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`digu-cli autocomplete [SHELL]`](#digu-cli-autocomplete-shell)
* [`digu-cli commands`](#digu-cli-commands)
* [`digu-cli hello PERSON`](#digu-cli-hello-person)
* [`digu-cli hello world`](#digu-cli-hello-world)
* [`digu-cli help [COMMANDS]`](#digu-cli-help-commands)
* [`digu-cli ig list followers`](#digu-cli-ig-list-followers)
* [`digu-cli ig list following`](#digu-cli-ig-list-following)
* [`digu-cli ig unfollow list USERSFILE`](#digu-cli-ig-unfollow-list-usersfile)
* [`digu-cli ig unfollow user USERTOUNFOLLOW`](#digu-cli-ig-unfollow-user-usertounfollow)
* [`digu-cli plugins`](#digu-cli-plugins)
* [`digu-cli plugins:install PLUGIN...`](#digu-cli-pluginsinstall-plugin)
* [`digu-cli plugins:inspect PLUGIN...`](#digu-cli-pluginsinspect-plugin)
* [`digu-cli plugins:install PLUGIN...`](#digu-cli-pluginsinstall-plugin-1)
* [`digu-cli plugins:link PLUGIN`](#digu-cli-pluginslink-plugin)
* [`digu-cli plugins:uninstall PLUGIN...`](#digu-cli-pluginsuninstall-plugin)
* [`digu-cli plugins:uninstall PLUGIN...`](#digu-cli-pluginsuninstall-plugin-1)
* [`digu-cli plugins:uninstall PLUGIN...`](#digu-cli-pluginsuninstall-plugin-2)
* [`digu-cli plugins update`](#digu-cli-plugins-update)
* [`digu-cli update [CHANNEL]`](#digu-cli-update-channel)
* [`digu-cli utils exclude EXCLUSIONFILE`](#digu-cli-utils-exclude-exclusionfile)

## `digu-cli autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ digu-cli autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ digu-cli autocomplete

  $ digu-cli autocomplete bash

  $ digu-cli autocomplete zsh

  $ digu-cli autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v2.1.6/src/commands/autocomplete/index.ts)_

## `digu-cli commands`

list all the commands

```
USAGE
  $ digu-cli commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.2.11/src/commands/commands.ts)_

## `digu-cli hello PERSON`

Say hello

```
USAGE
  $ digu-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/demarchenac/digu-cli/https://github.com/demarchenac/digu-cli/blob/v1.0.13/dist/commands/hello/index.ts)_

## `digu-cli hello world`

Say hello world

```
USAGE
  $ digu-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ digu-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

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

## `digu-cli ig list followers`

Should fetch a list of the accounts that are following the provided user

```
USAGE
  $ digu-cli ig list followers [-u <value>] [-p <value>] [-s] [-v]

FLAGS
  -p, --password=<value>  User's password.
  -s, --save              Whether or not this list should be saved.
  -u, --user=<value>      User's account.
  -v, --viewBrowser       Wether or not the browser should open in a headless manner

DESCRIPTION
  Should fetch a list of the accounts that are following the provided user

EXAMPLES
  $ digu-cli ig list followers (this way the CLI will ask relevant info it may need)

  $ digu-cli ig list followers -u <username> -p <password> -s
```

## `digu-cli ig list following`

Should fetch a list of the accounts that the provided user follows

```
USAGE
  $ digu-cli ig list following [-u <value>] [-p <value>] [-s] [-v]

FLAGS
  -p, --password=<value>  User's password.
  -s, --save              Whether or not this list should be saved.
  -u, --user=<value>      User's account.
  -v, --viewBrowser       Wether or not the browser should open in a headless manner

DESCRIPTION
  Should fetch a list of the accounts that the provided user follows

EXAMPLES
  $ digu-cli ig list following (this way the CLI will ask relevant info it may need)

  $ digu-cli ig list following -u <username> -p <password> -s
```

## `digu-cli ig unfollow list USERSFILE`

Should unfollow the specified @users from the unfollow list at the from the account provided.

```
USAGE
  $ digu-cli ig unfollow list USERSFILE [-u <value>] [-p <value>] [-v] [--keepFavorites]

ARGUMENTS
  USERSFILE  Json file containing a list of @users

FLAGS
  -p, --password=<value>  User's password.
  -u, --user=<value>      User's account.
  -v, --viewBrowser       Wether or not the browser should open in a headless manner
  --keepFavorites         This flag avoid unfollowing accounts that your profile has marked as favorite

DESCRIPTION
  Should unfollow the specified @users from the unfollow list at the from the account provided.

EXAMPLES
  $ digu-cli ig unfollow list <JSON file with a list of @users to unfollow> (this way the CLI will ask relevant info it may need)

  $ digu-cli ig unfollow list <JSON file with a list of @users to unfollow> -u <username> -p <password>
```

## `digu-cli ig unfollow user USERTOUNFOLLOW`

Should unfollow the specified @user from the account provided.

```
USAGE
  $ digu-cli ig unfollow user USERTOUNFOLLOW [-u <value>] [-p <value>] [-v] [--keepFavorites]

ARGUMENTS
  USERTOUNFOLLOW  the user tag that must be unfollowed

FLAGS
  -p, --password=<value>  User's password.
  -u, --user=<value>      User's account.
  -v, --viewBrowser       Wether or not the browser should open in a headless manner
  --keepFavorites

DESCRIPTION
  Should unfollow the specified @user from the account provided.

EXAMPLES
  $ digu-cli ig unfollow user <@userToUnfollow> (this way the CLI will ask relevant info it may need)

  $ digu-cli ig unfollow user <@userToUnfollow> -u <username> -p <password>
```

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

## `digu-cli update [CHANNEL]`

update the digu-cli CLI

```
USAGE
  $ digu-cli update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the digu-cli CLI

EXAMPLES
  Update to the stable channel:

    $ digu-cli update stable

  Update to a specific version:

    $ digu-cli update --version 1.0.0

  Interactively select version:

    $ digu-cli update --interactive

  See available versions:

    $ digu-cli update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.8/src/commands/update.ts)_

## `digu-cli utils exclude EXCLUSIONFILE`

Should exclude a list from another one

```
USAGE
  $ digu-cli utils exclude EXCLUSIONFILE -f <value> [-o <value>]

ARGUMENTS
  EXCLUSIONFILE  List in json format used to remove from --from list

FLAGS
  -f, --fromFile=<value>    (required) Source list to modify
  -o, --outputFile=<value>  Output filename

DESCRIPTION
  Should exclude a list from another one

EXAMPLES
  $ digu-cli utils exclude <exclusion_list> -f <source_list>
```
<!-- commandsstop -->
