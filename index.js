const microApi = require('micro-api')
const fs = require('fs-promise')
const aliases = require('./data/aliases')

const mapAlias = countryCode => {
  let code = countryCode.toLowerCase()
  const alias = aliases[code]
  if (alias) {
    code = alias.code.toLowerCase()
  }
  return code
}

const handleFlag = async ({ params: { countryCode }, res }) => {
  countryCode = mapAlias(countryCode)
  try {
    const flag = await fs.readFile(`./flags/${countryCode}.png`)
    res.setHeader('Content-Type', 'image/png')
    return flag
  } catch (err) {
    // Autos to 404
    return null
  }
}

const handleNone = (() => 'You mustly supply a country code.\nGET /:countryCode')

const handleList = async ({ res }) => {
  try {
    res.setHeader('Content-Type', 'application/json')
    const list = await fs.readFile('./flags.json')
    return list
  } catch (err) {
    // Autos to 404
    return null
  }
}

const api = microApi([
  {
    method: 'get',
    path: '/',
    handler: handleNone
  },
  {
    method: 'get',
    path: '/flags',
    handler: handleList
  },
  {
    method: 'get',
    path: '/:countryCode',
    handler: handleFlag
  }
])

module.exports = api
