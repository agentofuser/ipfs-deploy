const ora = require('ora')
const colors = require('colors/safe')
const { logError } = require('./logging')
const white = colors.brightWhite

module.exports = async (provider, domain, hash, options) => {
  const name = white(provider.name)
  const spinner = ora()

  try {
    spinner.start(`⚙️  Validating configuration for ${name}…`)
    await provider.validate(options)
  } catch (error) {
    spinner.fail(`💔  Missing arguments for ${name} API.`)
    logError(error)
    return
  }

  spinner.info(`📡  Beaming new hash to DNS provider ${name}…`)

  try {
    const { record, value } = await provider.link(domain, hash, options)
    spinner.succeed('🙌  SUCCESS!')
    spinner.info(`🔄  Updated DNS TXT ${white(record)} to:`)
    spinner.info(`🔗  ${white(value)}`)

    return record
      .split('.')
      .slice(1)
      .join('.')
  } catch (error) {
    spinner.fail(`💔  Updating ${name} DNS didn't work.`)
    logError(error)
  }
}
