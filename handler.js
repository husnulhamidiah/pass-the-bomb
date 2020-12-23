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

    // update room
    store.setRoom(room.id, room)

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

    // confirm player is in room
    const pid = room.players.findIndex(e => e.id === playerid)
    if (pid === -1) {
      return
    }

    // confirm its player turns
    if (room.curplayer !== pid) {
      return
    }

    // decrement current round's tapleft
    room.rounds[room.curround].tapleft -= 1

    // handle when tapleft reach zero
    let exploded = false
    if (room.rounds[room.curround].tapleft <= 0) {
      exploded = true
    }

    // update room
    store.setRoom(room.id, room)

    // send response evt
    room.players
      .map(p => memory.sockets[p.id])
      .forEach(sock => sock.emit(config.EVENT_DOWN_GAME_BOMB_TAP, {}))

    if (exploded) {
      room.players
        .map(p => memory.sockets[p.id])
        .forEach(sock => sock.emit(config.EVENT_DOWN_GAME_END, {})) // TODO: send score update
    }
  },

  handlePassBomb: (socket, data) => {
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

    // confirm player is in room
    const pid = room.players.findIndex(e => e.id === playerid)
    if (pid === -1) {
      return
    }

    // confirm its player turns
    if (room.curplayer !== pid) {
      return
    }

    // set cursor to next player
    room.curplayer = (room.curplayer + 1) % room.players.length
    const nextplayer = room.players[room.curplayer]

    // update room
    store.setRoom(room.id, room)

    // send response evt
    room.players
      .map(p => memory.sockets[p.id])
      .forEach(sock => sock.emit(config.EVENT_DOWN_GAME_BOMB_PASS, {}))
    memory.sockets[nextplayer.id].emit(config.EVENT_DOWN_GAME_TURN_START, {})
  }

}
