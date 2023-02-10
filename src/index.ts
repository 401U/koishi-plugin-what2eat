import type { Context } from 'koishi'
import { Schema } from 'koishi'

export const name = 'what2eat'

export interface Config {}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('今天吃什么')
    .alias('今天吃啥')
    .action(() => '不知道吃啥嘞')

  ctx.command('今天喝什么')
    .alias('今天喝啥')
    .action(() => '不知道喝啥嘞')
}
