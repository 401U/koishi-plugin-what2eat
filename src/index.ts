import type { Context } from 'koishi'
import { $, Logger, Schema } from 'koishi'

declare module 'koishi' {
  interface Tables {
    'what2eat': Eatable
  }
}

export interface Eatable {
  id: number
  type: 'food' | 'drink'
  name: string
  weight: number
  specific: string
}

const logger = new Logger('what2eat')

export const name = 'what2eat'
// export const using = ['database'] as const

export interface Config {}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  async function isInited(): Promise<boolean> {
    const length: number = await ctx.database?.eval('what2eat', row => $.count(row.id))
    return length > 0
  }

  const totalWeight = async (type: 'food' | 'drink' | null) => {
    switch (type) {
      case 'food':
        return await ctx.database?.eval('what2eat', row => $.sum(row.weight), { type: 'food' })
      case 'drink':
        return await ctx.database?.eval('what2eat', row => $.sum(row.weight), { type: 'drink' })
      default:
        return await ctx.database?.eval('what2eat', row => $.sum(row.weight))
    }
  }

  ctx.model.extend('what2eat', {
    id: 'unsigned',
    type: 'string',
    name: 'string',
    weight: 'unsigned',
    specific: 'string',
  }, {
    autoInc: true,
  })

  // 在插件加载时，检查是否要生成数据库内容
  ctx.on('ready', async () => {
    if (await isInited()) {
      logger.info('数据库表已初始化')
      return
    }
    logger.info('初始化数据库表中')
    // TODO: setup database table for what2eat
    // const testdata: Array<Eatable> = [
    //   {
    //     id: 1,
    //     type: 'food',
    //     name: 'banana',
    //     weight: 100,
    //     specific: '',
    //   },
    //   {
    //     id: 2,
    //     type: 'food',
    //     name: 'apple',
    //     weight: 100,
    //     specific: '',
    //   },
    //   {
    //     id: 3,
    //     type: 'drink',
    //     name: 'orange',
    //     weight: 100,
    //     specific: '',
    //   },
    //   {
    //     id: 4,
    //     type: 'drink',
    //     name: 'water',
    //     weight: 100,
    //     specific: '',
    //   },
    // ]
    // testdata.forEach(async (row) => {
    //   return await ctx.database?.create('what2eat', row)
    // })
    await ctx.database.upsert('what2eat', [
      { id: 1, type: 'food', name: 'banana', weight: 100, specific: '' },
      { id: 2, type: 'food', name: 'apple', weight: 100, specific: '' },
      { id: 3, type: 'drink', name: 'orange', weight: 100, specific: '' },
      { id: 4, type: 'drink', name: 'water', weight: 100, specific: '' },
    ],
    )
    //
    logger.info('数据库表初始化完成')
  })

  ctx.command('今天吃什么')
    .alias('今天吃啥')
    .action(async () => {
      const food = await ctx.database.get('what2eat', 2)
      logger.info(food)
      return food[0]?.name ?? '不知道吃啥嘞'
    })

  ctx.command('今天喝什么')
    .alias('今天喝啥')
    .action(async () => {
      const drink = await ctx.database.get('what2eat', 3)
      logger.info(drink)
      return drink[0]?.name ?? '不知道喝啥嘞'
    })
}
