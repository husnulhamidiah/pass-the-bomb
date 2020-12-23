import store from './store'

export default {
  handleCreateGame: (socket, data) => {
    const id = '1234' // TODO: generate unique easy id
    store.setRoom(id, {
      id: id,
      players: [],
      rounds: []
    })
  },

  handleJoinGame: (socket, data) => {
    // TODO: update room, add player id and socket reference to room
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
