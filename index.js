import http from 'http'
import socket from 'socket.io'

// setup http and websocket server
const server = http.createServer()
const io = socket(server)

io.on('connection', socket => {
  socket.on('ping', () => {
    socket.emit('ping', 'pong')
  })
})

server.listen(3000, () => {
  console.log('server running on port 3000')
})
