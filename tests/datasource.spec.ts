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

  it('should have no food/drink for me', async () => {
    expect(await datasource?.getRandom('food')).to.equal('菜单丢掉了T_T')
    expect(await datasource?.getRandom('drink')).to.equal('菜单丢掉了T_T')
  })
})

describe('datasource test after load custom data', async () => {
  before(async () => await datasource?.loadData([
    { id: 1, type: 'food', name: 'banana', weight: 100, specific: '' },
    { id: 2, type: 'food', name: 'apple', weight: 100, specific: '' },
    { id: 3, type: 'drink', name: 'cola', weight: 100, specific: '' },
    { id: 4, type: 'drink', name: 'water', weight: 100, specific: '' },
  ]))

  it('should be inited', async () => {
    expect(await datasource?.isInited()).to.equal(true)
  })

  it('should have correct row length', async () => {
    expect(await datasource?.rowLength()).to.equal(4)
    expect(await datasource?.rowLength('food')).to.equal(2)
    expect(await datasource?.rowLength('drink')).to.equal(2)
  })

  it('should give random food/drink', async () => {
    expect(await datasource?.getRandom('food')).to.be.oneOf(['banana', 'apple'])
    expect(await datasource?.getRandom('drink')).to.be.oneOf(['cola', 'water'])
  })
})

describe('datasource test after init', async () => {
  before(async () => await datasource?.init())
  it('should be inited', async () => {
    expect(await datasource?.isInited()).to.equal(true)
  })
})
