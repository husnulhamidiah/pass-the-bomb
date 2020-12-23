import nanoid from 'nanoid'
import store from './store'
import memory from './memory'

const genid = nanoid.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

export default {
  handleCreateGame: (socket, data) => {
    // const { } = data

    // generate things
    const id = genid()
    const room = {
      id: id,
      players: [],
      rounds: []
    }

    // add current socket as player
    const player = { id: genid(), isAdmin: true }
    memory.sockets[player.id] = socket
    room.players.push(player)

    // update room
    store.setRoom(id, room)
  },

  handleJoinGame: (socket, data) => {
    const { roomid } = data

    // find room
    const room = store.getRoom(roomid)
    if (!room) {
      return
    }

    // add current socket as player
    const player = { id: genid() }
    memory.sockets[player.id] = socket
    room.players.push(player)

    // update room
    store.setRoom(room.id, room)
  },

  handleStartGame: (socket, data) => {
    // TODO: shuffle player order
    // TODO: generate rounds
    // TODO: set round cursor
    // TODO: set player cursor
  },

  handleTapBomb: (socket, data) => {
    // TODO: decrement current round's hitnumber

  },

  handlePassBomb: (socket, data) => {
    // TODO: set cursor to next player
  }

}
