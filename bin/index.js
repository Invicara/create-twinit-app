#! /usr/bin/env node

const path = require('path')
const fs = require('fs')
const { createRequire } = require('module')
const { parseCliArgs } = require('./parse-cli-args')

const cliRoot = path.join(__dirname, '..')
const cliRequire = createRequire(path.join(cliRoot, 'package.json'))

const appPackage = cliRequire('./package.json')
const packageTemplate = cliRequire('./bin/package.json')

const PROMPTS = [
  { key: 'name', prompt: 'Twinit app name:', default: 'my-twinit-react-client' },
  { key: 'description', prompt: 'Twinit app description:', default: 'My Twinit React Client Description' },
  { key: 'version', prompt: 'Version:', default: '1.0.0' },
  { key: 'author', prompt: 'Author:', default: 'None' },
  {
    key: 'applicationId',
    prompt: 'Application ID (required - default = dev-training):',
    default: '77b2cdca-c1a3-4d27-9d19-7b5358e3b337',
  },
  {
    key: 'configUserType',
    prompt: 'Config _userType: (required - default = dev-training):',
    default: 'dev-train',
  },
  {
    key: 'apiUrl',
    prompt: 'Twinit API URL:',
    default: 'https://sandbox-api.invicara.com',
  },
]

function printHelp() {
  console.log(`Usage: npx create-twinit-app@latest [options]

Scaffolds a new Twinit React client application.

Options (use --key=value; quote values that contain spaces):
  --name=<name>, -n=<name>              Twinit app name (default: my-twinit-react-client)
  --description=<text>, --desc=<text>   App description
  --version=<version>, -v=<version>     package.json version (default: 1.0.0)
  --author=<name>                       package.json author (default: None)
  --application-id=<id>, --app-id=<id>   Twinit application ID
  --config-user-type=<type>             User config _userType (default: dev-train)
  --twinit-api-url=<url>, --api-url=<url> Twinit API URL (default: https://sandbox-api.invicara.com)
  --help, -h                            Show this help message

Any option not supplied on the command line will be prompted interactively.
If every option is supplied, no prompts are shown.

Examples:
  npx create-twinit-app@latest -- --name=my-app --author=John
  npx create-twinit-app@latest -- --name="my new app" --description="my new app example" --version=1.0.2

Note: include "--" after the package name when using npx so npm forwards flags to this tool.
Until a version with CLI flag support is published, test locally with:
  node path/to/create-twinit-app/bin/index.js --name=my-app
`)
}

async function promptValue({ prompt, default: defaultValue }, cliValue, read) {
  if (cliValue !== undefined && cliValue !== '') {
    return cliValue
  }

  return read({ prompt, default: defaultValue })
}

function logCliUsage(cli) {
  const usedKeys = PROMPTS.map((field) => field.key).filter(
    (key) => cli[key] !== undefined && cli[key] !== ''
  )

  if (usedKeys.length === 0) {
    return
  }

  console.log(`--> Using command-line options for: ${usedKeys.join(', ')}`)

  const missingKeys = PROMPTS.map((field) => field.key).filter(
    (key) => cli[key] === undefined || cli[key] === ''
  )

  if (missingKeys.length > 0) {
    console.log(`--> Prompting for: ${missingKeys.join(', ')}`)
  }
}

function ensureCliDependencies() {
  try {
    cliRequire.resolve('decompress')
    cliRequire.resolve('read')
  } catch (error) {
    console.error('Error: create-twinit-app CLI dependencies are not installed.')
    console.error(`Run: cd "${cliRoot}" && npm install`)
    process.exit(1)
  }
}

async function main() {
  const cli = parseCliArgs(process.argv)

  if (cli.help) {
    printHelp()
    return
  }

  if (path.resolve(process.cwd()) === path.resolve(cliRoot)) {
    console.error('Error: Run this command from an empty project folder, not inside the create-twinit-app repository.')
    process.exit(1)
  }

  ensureCliDependencies()

  logCliUsage(cli)

  const { read } = cliRequire('read')
  const options = {}

  for (const field of PROMPTS) {
    options[field.key] = await promptValue(
      { prompt: field.prompt, default: field.default },
      cli[field.key],
      read
    )
  }

  const { name: appName, description: desc, version, author, applicationId: appId, configUserType: cfgtype, apiUrl: url } = options

  const decompress = cliRequire('decompress')
  await decompress(path.join(__dirname, 'starter-app-source.zip'), './', { strip: 1 })

  packageTemplate.name = appName.replaceAll(' ', '-').toLowerCase()
  packageTemplate.description = desc
  packageTemplate.version = version
  packageTemplate.author = author
  packageTemplate.type = 'module'
  packageTemplate.dev_twinit = {
    createdBy: `create-twinit-app@${appPackage.version}`,
  }

  fs.writeFileSync('./package.json', JSON.stringify(packageTemplate, null, 3))

  fs.writeFileSync(
    './app/public/config.js',
    `const endPointConfig = {
   itemServiceOrigin: ${JSON.stringify(url)},
   passportServiceOrigin: ${JSON.stringify(url)},
   fileServiceOrigin: ${JSON.stringify(url)},
   datasourceServiceOrigin: ${JSON.stringify(url)},
   graphicsServiceOrigin: ${JSON.stringify(url)},
   baseRoot: 'http://localhost:8084',
   applicationId: ${JSON.stringify(appId)}
}`
  )

  fs.writeFileSync(
    './app/ipaCore/ipaConfig.js',
    `const ipaConfig = {
   appName: ${JSON.stringify(appName)},
   configUserType: ${JSON.stringify(cfgtype)},
   applicationId: ${JSON.stringify(appId)},
   scriptPlugins: [],
   css: [],
   redux: {
      slices: []
   },
   components: {
      dashboard: [],
      entityData: [],
      entityAction: []
   }
}

export default ipaConfig`
  )

  console.log('--> New Twinit React Client App Setup Complete')
  console.log('--> Run "npm install" to install node modules')
  console.log('--> Run "npm run watch" to start local client')
  console.log('--> Client will be served at http://localhost:8084')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
