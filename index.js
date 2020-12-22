import {} from 'dotenv/config'
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

const port = process.env.PORT

server.listen(port, () => {
  console.log(`server running on port ${port}`)
})
