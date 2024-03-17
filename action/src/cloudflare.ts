import { Cloudflare as CF } from 'cloudflare'

type Response<T> = [T | null, string | null]

export class Cloudflare {
  private client: CF

  constructor(params: { email: string; key: string }) {
    this.client = new CF({
      apiEmail: params.email,
      apiKey: params.key,
    })
  }

  private async getZoneId(name: string) {
    const zones = await this.client.zones.list()
    const zone = zones.result.find((zone) => zone.name === name)

    return zone?.id
  }

  private async getDNSRecord(zoneId: string, name: string) {
    const records = await this.client.dns.records.list({
      zone_id: zoneId,
      type: 'A',
    })
    const record = records.result.find((record) => record.name.includes(name))

    return record?.id
  }

  async createDNSRecord(
    domain: string,
    name: string,
    target: string,
  ): Promise<Response<void>> {
    try {
      const zoneId = await this.getZoneId(domain)
      if (!zoneId) {
        return [null, 'Zone not found']
      }

      await this.client.dns.records.create({
        // @ts-ignore
        content: target,
        zone_id: zoneId,
        type: 'A' as 'URI',
        proxied: false,
        name,
      })
      return [null, null]
    } catch (error) {
      return [null, error.message]
    }
  }

  async deleteDNSRecord(domain: string, name: string): Promise<Response<void>> {
    try {
      const zoneId = await this.getZoneId(domain)
      if (!zoneId) {
        return [null, 'Zone not found']
      }

      const recordId = await this.getDNSRecord(zoneId, name)
      if (!recordId) {
        return [null, 'Record not found']
      }

      await this.client.dns.records.delete(recordId, {
        zone_id: zoneId,
      })
      return [null, null]
    } catch (error) {
      return [null, error.message]
    }
  }
}
