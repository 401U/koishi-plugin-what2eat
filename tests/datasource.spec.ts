import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'
import memory from '@koishijs/plugin-database-memory'
import { expect } from 'chai'
import { DataSource } from '../src/datasource'

const app = new App()
app.plugin(mock)
app.plugin(memory)

let datasource: DataSource | null = null

before(() => {
  app.start()
  datasource = new DataSource(app)
})
after(() => app.stop())

describe('datasource test before init ', () => {
  it('should not be inited', async () => {
    expect(await datasource?.isInited()).to.equal(false)
  })
})

describe('datasource test after init ', async () => {
  before(async () => await datasource?.init())

  it('should be inited', async () => {
    expect(await datasource?.isInited()).to.equal(true)
  })

  it('should have correct total weight', async () => {
    expect(await datasource?.totalWight()).to.equal(400)
    expect(await datasource?.totalWight('food')).to.equal(200)
    expect(await datasource?.totalWight('drink')).to.equal(200)
  })

  it('should have correct row length', async () => {
    expect(await datasource?.rowLength()).to.equal(4)
    expect(await datasource?.rowLength('food')).to.equal(2)
    expect(await datasource?.rowLength('drink')).to.equal(2)
  })
})
