/* global process, require */

require(`babel-core/register`)

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import chalk from 'chalk'
import config from './config'
import router from './router'
import { Server } from 'http'

mongoose.connect(config.database)

let app = express()
let http = Server(app)

let port = process.env.PORT || 8080

app.set(`superSecret`, config.secret)

app.use(cors())
app.use(bodyParser.urlencoded({ limit: `50mb`, extended: false }))
app.use(bodyParser.json({ limit: `50mb` }))
app.use(`/api`, router({ app }))

http.listen(port, () => {
  console.log(chalk.white(`☆ listening on localhost:${port}`))
})
