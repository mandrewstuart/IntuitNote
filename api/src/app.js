/* global process, require */

require(`babel-core/register`)

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import chalk from 'chalk'
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
app.use('/api', router({ app }))

http.listen(port, () => {
  console.log(chalk.white(`☆ listening on localhost:${port}`))
})
