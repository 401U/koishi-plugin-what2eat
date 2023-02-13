import type { Context } from 'koishi'
import { Logger, Schema } from 'koishi'
import { DataSource } from './datasource'

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
  const datasource = new DataSource(ctx)

  // 在插件加载时，检查是否要生成数据库内容
  ctx.on('ready', async () => {
    logger.info('plugin ready')
    if (!(await datasource.isInited())) {
      logger.info('初始化数据库表中')
      await datasource.init()
      logger.info('数据库表初始化完成')
    }
  })

  ctx.command('今天吃什么')
    .alias('今天吃啥')
    .action(async (user, group) => {
      const food = await datasource.getRandom('food', group)
      return food
    })

  ctx.command('今天喝什么')
    .alias('今天喝啥')
    .action(async (user, group) => {
      const drink = await datasource.getRandom('drink', group)
      return drink
    })
}
