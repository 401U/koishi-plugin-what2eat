import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'
import memory from '@koishijs/plugin-database-memory'
import * as what2eat from '../src'

const app = new App()
app.plugin(mock)
app.plugin(memory)

const clientA = app.mock.client('123')

before(() => {
  app.start()
  app.plugin(what2eat)
})
after(() => app.stop())

it('should recommand food to me', async () => {
  await clientA.shouldReply('今天吃什么', 'apple')
})

it('should recommand drink to me', async () => {
  await clientA.shouldReply('今天喝什么', 'orange')
})
