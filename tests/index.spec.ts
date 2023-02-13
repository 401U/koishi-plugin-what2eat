import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'
import memory from '@koishijs/plugin-database-memory'
import { expect } from 'chai'
import * as what2eat from '../src'
import { DataSource } from '../src/datasource'

describe('mock test with custom data', () => {
  const app = new App()
  app.plugin(mock)
  app.plugin(memory)
  const clientA = app.mock.client('123')
  const datasource = new DataSource(app)

  before(async () => {
    await app.start()
    await datasource.loadData([
      { id: 1, type: 'food', name: 'banana', weight: 100, specific: '' },
      { id: 2, type: 'drink', name: 'water', weight: 100, specific: '' },
    ])
    app.plugin(what2eat)
  })

  after(async () => {
    await app.stop()
  })

  it('should recommand food to me', async () => {
    await clientA.shouldReply('今天吃什么', 'banana')
  })

  it('should recommand drink to me', async () => {
    await clientA.shouldReply('今天喝什么', 'water')
  })
})

describe('test plugin load data', () => {
  const app = new App()
  app.plugin(mock)
  app.plugin(memory)
  const datasource = new DataSource(app)

  after(() => app.stop())

  it('should be able to init datasource', async () => {
    expect(await datasource?.isInited()).to.equal(false)
    app.plugin(what2eat)
    await app.start()
    expect(await datasource?.isInited()).to.equal(true)
  })
})
