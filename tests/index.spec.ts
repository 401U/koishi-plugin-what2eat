import { App } from "koishi";
import mock from '@koishijs/plugin-mock'
import * as what2eat from '../src'

const app = new App()
app.plugin(mock)
app.plugin(what2eat)

const clientA = app.mock.client('123')

before(() => { app.start() })
after(() => { app.stop() })

it('should work',async () => {
    await clientA.shouldReply("今天吃什么", "不知道吃啥嘞")
})
