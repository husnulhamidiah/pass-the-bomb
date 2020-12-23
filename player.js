import crypto from 'crypto'

class Player {
  constructor ({ name, props }) {
    this.id = this._genId()
    this.name = name
    this.props = props
  }

  _genId () {
    return crypto.randomBytes(4).toString('hex').toUpperCase()
  }
}

export default Player
