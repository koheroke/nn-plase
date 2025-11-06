import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static'
import http from 'http'
const app = new Hono()
app.use('/*', serveStatic({ root: './client/dist', index: 'index.html' }))
const server = http.createServer(app.fetch)
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
