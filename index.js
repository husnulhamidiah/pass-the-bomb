import {} from 'dotenv/config'
import http from 'http'
import path from 'path'
import express from 'express'
import socket from 'socket.io'

import handler from './handler'
import event from './event'

const app = express()
const server = http.createServer(app)

app.get('/', (req, res) => res.json({ msg: 'hello world' }))
app.get('/dev/panel/', (req, res) => res.sendFile(path.join(__dirname, 'dev/testpanel.html')))

// setup socket server
const io = socket(server)
io.on('connection', socket => {
  socket.on(event.CLIENT_CREATE_GAME, data => handler.handleCreateGame(socket, data))
  socket.on(event.CLIENT_JOIN_GAME, data => handler.handleJoinGame(socket, data))
  socket.on(event.CLIENT_START_GAME, data => handler.handleStartGame(socket, data))
})

// start server
const port = process.env.PORT
server.listen(port, () => {
  console.log(`server running on port ${port}`)
})
