import http from 'http'

const PORT = parseInt(process.env[['PORT'][0]] ?? '3000', 10)
const HOST = process.env[['HOST'][0]] || '127.0.0.1'

let app = require('./server').default

const server = http.createServer(app)

let currentApp = app

server
  .listen(PORT, HOST, () => {
    console.log(`🚀 Started on http://${HOST}:${PORT}`)
  })
  .on('error', (error) => {
    console.log(error)
  })

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!')

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...')

    try {
      app = require('./server').default
      server.removeListener('request', currentApp)
      server.on('request', app)
      currentApp = app
    } catch (error) {
      console.error(error)
    }
  })
}
