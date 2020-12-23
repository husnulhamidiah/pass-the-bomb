import {} from 'dotenv/config'
import http from 'http'
import path from 'path'
import express from 'express'
import socket from 'socket.io'

import Lobby from './lobby'
import Player from './player'

const app = express()
const server = http.createServer(app)

app.get('/', (req, res) => res.json({ msg: 'hello world' }))
app.get('/dev/panel/', (req, res) => res.sendFile(path.join(__dirname, 'dev/testpanel.html')))

// setup socket server
const io = socket(server)
io.on('connection', socket => {
  socket.on('ping', () => socket.emit('ping', 'pong'))
  socket.on('create', data => {
    const lobby = new Lobby()
    const player = new Player({ name: data.name })

    lobby.join(player.id)
    socket.join(lobby.id)
    socket.emit('create', {
      lobby: lobby.id
    })
  })
})

// start server
const port = process.env.PORT
server.listen(port, () => {
  console.log(`server running on port ${port}`)
})
