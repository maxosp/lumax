import express from 'express'
import serialize from 'serialize-javascript'
import { config } from './config'

const cors = require('cors')

let assets: {
  client: {
    css: string
    js: string
  }
}

const loadSvgSpriteForDev = () => {
  let sprite = ''
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line import/no-unresolved
    sprite = require('!!raw-loader!./assets/icons/sprite.svg').default
  }
  return `<div style="display: none;">${sprite}</div>`
}

const syncLoadAssets = () => {
  // eslint-disable-next-line import/no-dynamic-require
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
}
syncLoadAssets()

const markup = (assetsCss: string, assetsJs: string) => `
<!doctype html>
  <html lang="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <title>CMS Letovo Online</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.7/semantic.min.css" media="screen" title="no title" charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${assetsCss ? `<link rel="stylesheet" href="${assetsCss}">` : ''}
    <script>window.env = ${serialize(config)};</script>
    ${
      process.env.NODE_ENV === 'production'
        ? `<script src="${assetsJs}" defer></script>`
        : `<script src="${assetsJs}" defer crossorigin></script>`
    }
  </head>
  <body>
    ${loadSvgSpriteForDev()}
    <div id="app"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js" charset="utf-8"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.7/semantic.min.js" charset="utf-8"></script>
    <script src="https://storage.yandexcloud.net/lo-storage-main/frontend-static/ckeditor/ckeditor.js" charset="utf-8"></script>
  </body>
</html>
`

const server = express()

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  server.use('/api', require('express-http-proxy')('http://79.143.25.181/'))
}

server.use(cors())

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    res.send(markup(assets.client.css, assets.client.js))
  })

export default server
