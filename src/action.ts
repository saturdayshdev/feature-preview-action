import * as core from '@actions/core'
import { Cloudflare } from './cloudflare'
import { Portainer } from './portainer'
import config from './config'

const runDeploy = async () => {
  try {
    core.startGroup('Initialize Cloudflare')
    const cloudflare = new Cloudflare({
      email: config.cloudflare.email,
      key: config.cloudflare.apiKey,
    })
    core.endGroup()

    core.startGroup('Create DNS Records')
    core.info(JSON.stringify(config.cloudflare))
    await cloudflare.createDNSRecord(
      config.cloudflare.domain,
      `${config.feature}.feature`,
      config.cloudflare.target,
    )
    core.endGroup()

    core.startGroup('Initialize Portainer')
    const portainer = new Portainer({
      baseUrl: config.portainer.baseUrl,
      username: config.portainer.username,
      password: config.portainer.password,
    })
    core.endGroup()

    core.startGroup('Deploy Stack')
    core.info(JSON.stringify(config.stack))
    const endpointId = Number(config.portainer.endpointId)
    await portainer.createStack(endpointId, {
      name: config.stack.name,
      stackFileContent: config.stack.stack,
      env: config.env,
    })
    core.info('Stack deployed')
    core.endGroup()
  } catch (error) {
    core.setFailed(error)
  }
}

const runRemove = async () => {
  try {
    core.startGroup('Initialize Cloudflare')
    const cloudflare = new Cloudflare({
      email: config.cloudflare.email,
      key: config.cloudflare.apiKey,
    })
    core.endGroup()

    core.startGroup('Remove DNS Records')
    core.info(JSON.stringify(config.cloudflare))
    await cloudflare.deleteDNSRecord(
      config.cloudflare.domain,
      `${config.feature}.feature`,
    )
    core.endGroup()

    core.startGroup('Initialize Portainer')
    const portainer = new Portainer({
      baseUrl: config.portainer.baseUrl,
      username: config.portainer.username,
      password: config.portainer.password,
    })
    core.endGroup()

    core.startGroup('Remove Stack')
    core.info(JSON.stringify(config.stack))
    const endpointId = Number(config.portainer.endpointId)
    const stack = await portainer.getStackByName(config.stack.name, endpointId)
    await portainer.deleteStack(stack.Id, endpointId)
    core.info('Stack removed')
  } catch (error) {
    core.setFailed(error)
  }
}

const run = async () => {
  core.startGroup('Get Type')
  const type = config.type
  core.info(`Type: ${type}`)

  if (type === 'deploy') {
    core.endGroup()
    return runDeploy()
  }

  if (type === 'remove') {
    core.endGroup
    return runRemove()
  }
}

run()
