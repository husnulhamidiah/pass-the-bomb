const store = {}

export default {
  getRoom: (id) => {
    return store[id]
  },

  setRoom: (id, room) => {
    store[id] = room
    // console.log(JSON.stringify(store))
  }
}
