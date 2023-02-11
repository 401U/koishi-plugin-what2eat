import type { Context } from 'koishi'
import { Logger, Schema } from 'koishi'

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
export const using = ['database'] as const

export interface Config {}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  async function isInited(): Promise<boolean> {
    const length: number = await ctx.database.eval('what2eat', row => $.count(row.id))
    return length > 0
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
  ctx.on('ready',async () => {
    if(await isInited()) {
      logger.info('数据库表已初始化')
      return
    }
    logger.info('初始化数据库表中')
    // TODO: setup database table for what2eat
    logger.info('数据库表初始化完成')
  })
  ctx.command('今天吃什么')
    .alias('今天吃啥')
    .action(() => '不知道吃啥嘞')

  ctx.command('今天喝什么')
    .alias('今天喝啥')
    .action(() => '不知道喝啥嘞')
}
