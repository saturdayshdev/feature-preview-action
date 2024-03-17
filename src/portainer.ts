import axios from 'axios'
import type { Axios } from 'axios'

interface ICreateStackConfig {
  env: {
    name: string
    value: string
  }[]
  fromAppTemplate?: boolean
  name: string
  stackFileContent: string
  webhook?: string
}

export class Portainer {
  private readonly baseUrl: string
  private readonly username: string
  private readonly password: string
  private readonly axios: Axios
  private token: string

  constructor(params: { baseUrl: string; username: string; password: string }) {
    this.baseUrl = `${params.baseUrl}/api`
    this.username = params.username
    this.password = params.password
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.token = null
  }

  private async authenticate() {
    if (this.token) return

    const { data } = await this.axios.post('/auth', {
      username: this.username,
      password: this.password,
    })

    this.token = data.jwt
  }

  public async createStack(endpointId: number, stack: ICreateStackConfig) {
    await this.authenticate()

    const { data } = await this.axios.post(
      '/stacks/create/standalone/string',
      {
        ...stack,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          endpointId,
        },
      },
    )

    return data
  }

  public async getAllStacks(endpointId?: number) {
    await this.authenticate()

    const { data } = await this.axios.get('/stacks', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        filters: endpointId ? JSON.stringify({ endpointId }) : undefined,
      },
    })

    return data
  }

  public async getStackByName(name: string, endpointId: number) {
    const stacks = await this.getAllStacks(endpointId)
    return stacks.find((stack) => stack.Name === name)
  }

  public async deleteStack(stackId: string, endpointId: number) {
    await this.authenticate()

    const { data } = await this.axios.delete(`/stacks/${stackId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        endpointId,
      },
    })

    return data
  }
}
