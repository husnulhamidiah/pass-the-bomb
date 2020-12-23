import nanoid from 'nanoid'
import * as config from './config'
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
      rounds: [],

      curplayer: -1,
      curround: -1
    }

    // add current socket as player
    const player = { id: genid(), isAdmin: true }
    memory.sockets[player.id] = socket
    room.players.push(player)

    // update room
    store.setRoom(id, room)

    // send response evt
    socket.emit(config.EVENT_DOWN_GAME_CREATED, { roomid: room.id, player: player })
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

    // send response evt
    room.players
      .map(p => memory.sockets[p.id])
      .forEach(sock => sock.emit(config.EVENT_DOWN_PLAYER_JOINED, { player: player }))
  },

  handleStartGame: (socket, data) => {
    const { playerid, roomid } = data

    // confirm socket
    if (socket !== memory.sockets[playerid]) {
      return
    }

    // find room
    const room = store.getRoom(roomid)
    if (!room) {
      return
    }

    // TODO: shuffle player order
    // generate rounds
    const roundcount = 5
    for (let i = 0; i < roundcount; i++) {
      room.rounds.push({
        tapleft: 5 + Math.floor(Math.random() * 20)
      })
    }

    // set cursors
    room.curround = 0
    room.curplayer = 0

    // send response evt
    room.players
      .map(p => memory.sockets[p.id])
      .forEach(sock => sock.emit(config.EVENT_DOWN_GAME_START, {}))

    const playerinturn = [room.players[room.curplayer]]
    playerinturn
      .map(p => memory.sockets[p.id])
      .forEach(sock => sock.emit(config.EVENT_DOWN_GAME_TURN_START, {}))
  },

  handleTapBomb: (socket, data) => {
    // TODO: decrement current round's hitnumber

  },

  handlePassBomb: (socket, data) => {
    // TODO: set cursor to next player
  }

}
