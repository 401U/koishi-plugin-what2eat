import type { Context } from 'koishi'
import { $, Random } from 'koishi'

export class DataSource {
  private readonly ctx: Context
  constructor(ctx: Context) {
    this.ctx = ctx
    ctx.model.extend('what2eat', {
      id: 'unsigned',
      type: 'string',
      name: 'string',
      weight: 'unsigned',
      specific: 'string',
    }, {
      autoInc: true,
    })
  }

  async init(): Promise<void> {
    await this.loadData([
      { id: 1, type: 'food', name: 'banana', weight: 100, specific: '' },
      { id: 2, type: 'food', name: 'apple', weight: 100, specific: '' },
      { id: 3, type: 'drink', name: 'orange', weight: 100, specific: '' },
      { id: 4, type: 'drink', name: 'water', weight: 100, specific: '' },
    ])
  }

  async loadData(data: Array<any>) {
    await this.ctx.database.upsert('what2eat', data)
  }

  async isInited(): Promise<boolean> {
    return await this.rowLength() > 0
  }

  async rowLength(type: 'food' | 'drink' | null = null): Promise<number> {
    switch (type) {
      case 'food':
        return await this.ctx.database?.eval('what2eat', row => $.count(row.id), { type: 'food' })
      case 'drink':
        return await this.ctx.database?.eval('what2eat', row => $.count(row.id), { type: 'drink' })
      default:
        return await this.ctx.database?.eval('what2eat', row => $.count(row.id))
    }
  }

  async getRandom(type: 'food' | 'drink' = 'food', guild = ''): Promise<string> {
    const rows = await this.ctx.database?.get('what2eat', {
      type: [type],
    })
    const totalWeight = rows.reduce((total, row) => total + row.weight, 0)
    const selectedWeight = Random.int(1, totalWeight)
    let w = selectedWeight
    for (const row of rows) {
      w = w - row.weight
      if (w <= 0)
        return row.name
    }
    return '菜单丢掉了T_T'
  }
}
