import {} from 'dotenv/config'
import http from 'http'
import path from 'path'
import express from 'express'
import socket from 'socket.io'

import handler from './handler'
import * as config from './config'

const app = express()
const server = http.createServer(app)

app.get('/', (req, res) => res.json({ msg: 'hello world' }))
app.get('/dev/panel/', (req, res) => res.sendFile(path.join(__dirname, 'dev/testpanel.html')))

// setup socket server
const io = socket(server)
io.on('connection', socket => {
  socket.on('ping', (data) => socket.emit('pong', data))

  socket.on(config.EVENT_UP_CREATE_GAME, data => handler.handleCreateGame(socket, data))
  socket.on(config.EVENT_UP_JOIN_GAME, data => handler.handleJoinGame(socket, data))
  socket.on(config.EVENT_UP_START_GAME, data => handler.handleStartGame(socket, data))

  socket.on(config.EVENT_UP_GAME_TAP_BOMB, data => handler.handleTapBomb(socket, data))
  socket.on(config.EVENT_UP_GAME_PASS_BOMB, data => handler.handlePassBomb(socket, data))
})

// start server
const port = process.env.PORT
server.listen(port, () => {
  console.log(`server running on port ${port}`)
})

// testing hehe
// ** testing
const evts = []
const s = {
  emit: (key, data) => {
    console.log('event emitted:', evts.length, key, JSON.stringify(data))
    evts.push({ key, data })
  }
}

handler.handleCreateGame(s, {})
handler.handleJoinGame(s, { roomid: evts[0].data.roomid })
handler.handleStartGame(s, { roomid: evts[0].data.roomid, playerid: evts[0].data.player.id })
handler.handleTapBomb(s, { roomid: evts[0].data.roomid, playerid: evts[0].data.player.id })
handler.handleTapBomb(s, { roomid: evts[0].data.roomid, playerid: evts[0].data.player.id })
handler.handleTapBomb(s, { roomid: evts[0].data.roomid, playerid: evts[0].data.player.id })
handler.handleTapBomb(s, { roomid: evts[0].data.roomid, playerid: evts[0].data.player.id })
handler.handleTapBomb(s, { roomid: evts[0].data.roomid, playerid: evts[0].data.player.id })
handler.handleTapBomb(s, { roomid: evts[0].data.roomid, playerid: evts[0].data.player.id })
handler.handlePassBomb(s, { roomid: evts[0].data.roomid, playerid: evts[0].data.player.id })
