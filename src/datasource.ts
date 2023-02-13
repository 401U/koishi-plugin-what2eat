import type { Context } from 'koishi'
import { $ } from 'koishi'

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

  async totalWight(type: 'food' | 'drink' | null = null) {
    switch (type) {
      case 'food':
        return await this.ctx.database?.eval('what2eat', row => $.sum(row.weight), { type: 'food' })
      case 'drink':
        return await this.ctx.database?.eval('what2eat', row => $.sum(row.weight), { type: 'drink' })
      default:
        return await this.ctx.database?.eval('what2eat', row => $.sum(row.weight))
    }
  }

  async getRandom(type: 'food' | 'drink' = 'food', guild = ''): Promise<string> {
    switch (type) {
      case 'food':
        return 'apple'
      case 'drink':
      default:
        return 'cola'
    }
  }
}
