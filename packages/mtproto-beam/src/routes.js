//@flow

import Router from 'koa-router'
import client from './client'

const router = Router()

router.post('/invoke/:method', async(ctx) => {
  const method = ctx.params.method || ''
  if (method === '') throw new Error(`Received empty method query`)
  console.log(`Call method ${method}`)
  const args = ctx.request.body || {}
  const result = await client(method, args)
  ctx.body = result
})

export default router
