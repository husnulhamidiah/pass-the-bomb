const store = {}

export default {
  getRoom: (id) => store[id],
  setRoom: (id, room) => { store[id] = room }
}
