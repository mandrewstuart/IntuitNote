/* global process, require */

require(`babel-core/register`)

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import config from './config'
import router from './router'
import socketIO from 'socket.io'
import { Server } from 'http'

let app = express()

let http = Server(app)
let io = socketIO(http)

let port = process.env.PORT || 8080
mongoose.connect(config.database)
app.set(`superSecret`, config.secret)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

io.on(`connection`, socket => {
  app.use('/api', router({ app, socket, io }))
})

http.listen(port, () => {
  console.log(`☆ listening on localhost:${port}`)
})
