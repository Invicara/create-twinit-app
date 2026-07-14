# create-twinit-app react application scaffold

create-twinit-app scaffolds a basic React application that uses ipa-core and the Twinit platform api node modules.
It is intended to be a starting point and as such will likely not meet your needs 100% out of the box, may include
more libraries than you require, or use tools that you don't use. It is expected that you will make the
changes you need to this scaffolded client.

There are three files you will most likely to adjust further:

- package.json: edit as you would for any react client application
- app/public/config.js: edit if you need to point your client to another Twinit instance or change your applciation id
- app/ipaCore/ipaConfig.js: edit as outlined in the ipa-core documentation to configure your client application

## Run Local Development

Before you can run the client you first need to be able to install dependecies from the @invicara and @dtplatform private npm repos.
TO help wiht this, an .npmrc file was created by create-twinit-app that will allow you to connect to these private repositories.
In order for the .npmrc file to work, you must set three environments on your system with your credentials.
Instruction on how to do this are available on [twnit.dev](https://twinit.dev/docs/apis/javascript/npm-install).
Be sure to follow those steps before going any further.

If you have created your environment variables and provided correct information when running create-twinit-app then to run the client all you need to do is:

1. npm install
2. npm run watch

## Build Deployable Client

The following command will build the client and write it to the build folder.

1. npm run build