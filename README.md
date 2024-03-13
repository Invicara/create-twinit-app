![digitaltwin-factory logo](./img/dtfactoryv3.png)

# digitaltwin-factory

create-twinit-app is made available as a part of the digitaltwin-factory open source community. Join the digitaltwin-factory community to gain access to a wealth of information and training material on how to use Twinit to accomplish your dgital twin goals. Membership in digitaltwin-factory open-source community includes access to self-led development courses for building applications using Twinit, access to the developer documentation for Twinit concepts, services, and APIs, access to open-source code modules and UI libraries to help accelerate and kick-start your projects, as well as access to a community of developers who develop using Twinit. For more information visit [https://invicara.com/](https://invicara.com/) and [https://twinit.com/](https://twinit.com/.)

digitaltwin-factory sign up link coming soon!

# CREATE-TWINIT-APP

create-twinit-app scaffolds a new Twinit React client application much in the same way the create-react-app initializes a new react application.

## Required Private Libraries

In order for the client to run, you will need to install private Twinit node modules. You can get access to these private code modules by joining the digitaltwin-factory open-source community. You will also need to configure the .npmrc file installed by create-twinit-app into your application folder. Instructions on how to do so are available [here](https://twinit.dev/docs/apis/javascript/npm-install).

## Running create-twinit-app

Before running create-twinit-app you may want to gather the follow information, as create-twinit-app will prompt you for it.
You may instead accept the defaults all the way through, and update the information later as well.

* Your application name (default: 'my-twinit-react-client')
* Your application description (default: 'My Twinit React Client Description')
* Your application version (default: '1.0.0')
* Your application author (default: 'None')
* Your Twinit Application ID (default: 'The Twinit Academy Training Application ID')
* Your Twinit application's user config _userType (default: 'dev-train')
* The Twinit API instance your client will connect to (default: 'https://sandbox-api.invicara.com')

When ready run:

```
npx create-twinit-app@latest
```

After create-twinit-app has finished you can run the empty client by*:
* Be sure you have read the note above about accessing private Twinit node modules.

```
npm install
npm run watch
```

The client will be served at http://localhost:8084. You can change this by adjusting the webpack config and the baseRoot in ./app/public/config.js.
If you do not have access to the private Twinit node modules, or have not set up your .npmrc file (provided by create-twinit-app) correctly, then you will authentication and access errors durin gthe npm install.
