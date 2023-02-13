import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'
import memory from '@koishijs/plugin-database-memory'
import * as what2eat from '../src'
import { DataSource } from '../src/datasource'

const app = new App()
app.plugin(mock)
app.plugin(memory)

const clientA = app.mock.client('123')

before(async () => {
  await app.start()
  const datasource = new DataSource(app)
  await datasource.loadData([
    { id: 1, type: 'food', name: 'banana', weight: 100, specific: '' },
    { id: 2, type: 'drink', name: 'water', weight: 100, specific: '' },
  ])
  app.plugin(what2eat)
})
after(() => app.stop())

describe('mock test for plugin', () => {
  it('should recommand food to me', async () => {
    await clientA.shouldReply('今天吃什么', 'banana')
  })

  it('should recommand drink to me', async () => {
    await clientA.shouldReply('今天喝什么', 'water')
  })
})
