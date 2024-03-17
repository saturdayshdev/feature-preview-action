import * as core from '@actions/core'
import * as mustache from 'mustache'
import * as fs from 'fs'

const input = (input: string, required: boolean = false) => {
  return core.getInput(input, { required })
}

const getPortainerConfig = () => {
  return {
    baseUrl: input('portainer-url', true),
    username: input('portainer-username', true),
    password: input('portainer-password', true),
    endpointId: input('portainer-endpoint-id', true),
  }
}

const getEnv = () => {
  const raw = input('env-file', true)
  const envs = raw.split('\n')
  return envs.map((env) => {
    const [name, value] = env.split('=')
    return { name, value }
  })
}

const getStackConfig = () => {
  const feature = input('feature', true)
  const path = input('stack-path', true)
  const file = fs.readFileSync(path, 'utf-8')
  const parsed = mustache.render(file, { feature })

  return {
    name: `feature-${feature}`,
    stack: parsed,
    pullImage: true,
    prune: true,
  }
}

const getCloudflareConfig = () => {
  return {
    email: input('cloudflare-email', true),
    apiKey: input('cloudflare-api-key', true),
    domain: input('cloudflare-domain', true),
    target: input('cloudflare-target', true),
  }
}

const getType = () => {
  return input('pr-status', true) === 'closed' ? 'remove' : 'deploy'
}

const config = {
  type: getType(),
  feature: input('feature', true),
  cloudflare: getCloudflareConfig(),
  portainer: getPortainerConfig(),
  env: getEnv(),
  stack: getStackConfig(),
}

export default config
