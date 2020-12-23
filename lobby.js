import crypto from 'crypto'

class Lobby {
  constructor (option = {}) {
    this.id = this._genId()
    this.players = []
    this.capacity = option.capacity || 4
  }

  join (player) {
    if (this.players.length >= this.capacity) {
      return false
    }
    this.players.push(player)
    return true
  }

  leave (player) {
    this.players = this.players.filter(id => id !== player)
  }

  isExist (player) {
    return this.players.indexOf(player) > -1
  }

  _genId () {
    return crypto.randomBytes(4).toString('hex').toUpperCase()
  }
}

export default Lobby
