//@flow

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors'

import { PORT, HOST } from './args'
import router from './routes'

const app = new Koa()

app.use(cors())
app.use(bodyParser())
app.use(async(ctx, next) => {
  try {
    ctx.status = 200
    await next(ctx)
    console.log('---OK---')
  } catch (err) {
    console.error(`---Error---\n`, err.message)
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(PORT, () => console.log(`
 + B E A M - - - - - - - - -

telegram-mtproto web service

  host ${HOST}
  port ${PORT}

`))

export default app

