const FLAG_ALIASES = {
  name: 'name',
  n: 'name',
  description: 'description',
  desc: 'description',
  version: 'version',
  v: 'version',
  author: 'author',
  'application-id': 'applicationId',
  'app-id': 'applicationId',
  applicationid: 'applicationId',
  appid: 'applicationId',
  'config-user-type': 'configUserType',
  'user-type': 'configUserType',
  usertype: 'configUserType',
  configusertype: 'configUserType',
  'twinit-api-url': 'apiUrl',
  'api-url': 'apiUrl',
  url: 'apiUrl',
}

function stripQuotes(value) {
  if (typeof value !== 'string') {
    return value
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function isFlagToken(arg) {
  return arg.startsWith('-')
}

function parseFlagToken(arg, argv, index) {
  let key
  let value
  let nextIndex = index

  if (arg.startsWith('--')) {
    const body = arg.slice(2)
    const equalsIndex = body.indexOf('=')

    if (equalsIndex !== -1) {
      key = body.slice(0, equalsIndex)
      value = body.slice(equalsIndex + 1)
    } else {
      key = body
      if (nextIndex + 1 < argv.length && !isFlagToken(argv[nextIndex + 1]) && argv[nextIndex + 1] !== '--') {
        nextIndex += 1
        value = argv[nextIndex]
      } else {
        return null
      }
    }
  } else if (arg.startsWith('-') && arg.length > 1) {
    const equalsIndex = arg.indexOf('=')

    if (equalsIndex !== -1) {
      key = arg.slice(1, equalsIndex)
      value = arg.slice(equalsIndex + 1)
    } else if (arg.length === 2) {
      key = arg.slice(1)
      if (nextIndex + 1 < argv.length && !isFlagToken(argv[nextIndex + 1]) && argv[nextIndex + 1] !== '--') {
        nextIndex += 1
        value = argv[nextIndex]
      } else {
        return null
      }
    } else {
      return null
    }
  } else {
    return null
  }

  const normalizedKey = FLAG_ALIASES[key.toLowerCase()] || key

  return {
    nextIndex,
    entry: [normalizedKey, stripQuotes(value)],
  }
}

function parseCliArgs(argv) {
  const args = {}

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--') {
      continue
    }

    if (arg === '--help' || arg === '-h') {
      args.help = true
      continue
    }

    if (!isFlagToken(arg)) {
      continue
    }

    const parsed = parseFlagToken(arg, argv, i)
    if (!parsed) {
      continue
    }

    const [normalizedKey, value] = parsed.entry
    args[normalizedKey] = value
    i = parsed.nextIndex
  }

  return args
}

module.exports = {
  FLAG_ALIASES,
  parseCliArgs,
  stripQuotes,
}
