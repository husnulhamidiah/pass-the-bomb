import store from './store'

export default {
  handleCreateGame: (sock, data) => {
    const id = '1234' // TODO: generate unique easy id
    store.setRoom(id, {
      id: id,
      players: [],
      rounds: []
    })
  },

  handleJoinGame: (sock, data) => {
    // TODO: update room, add player id and socket reference to room
  },

  handleStartGame: (sock, data) => {
    // TODO: shuffle player order
    // TODO: generate rounds
    // TODO: set round cursor
    // TODO: set player cursor

  },

  handleTapBomb: (sock, data) => {
    // TODO: decrement current round's hitnumber

  },

  handlePassBomb: (sock, data) => {
    // TODO: set cursor to next player
  }

}
