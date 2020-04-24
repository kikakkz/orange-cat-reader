const { store } = require('../utils/store-utils.js')
var uuid = require('react-native-uuid')

export const mine = new Object({
  loaded: false,
  key: 'mine_info',
  uuid: '',
  gender: '',
  generateUUID() {
    var buf = new Array(32)
    uuid.v1(null, buf, 0)
    uuid.v1(null, buf, 16)
    var uuidStr = uuid.unparse(buf)
    this.uuid = uuidStr
    this.save()
  },
  load() {
    if (this.loaded) {
      return new Promise((resolve) => {
        resolve(this)
        return
      })
    }
    return new Promise((resolve, reject) => {
      store.Load(this.key)
      .then((v) => {
        if (!v) {
          this.generateUUID()
          resolve(this)
          return
        }
        var obj = JSON.parse(v)
        this.uuid = obj.uuid
        this.gender = obj.gender
        resolve(this)
        this.loaded = true
      })
      .catch((e) => {
        reject(e)
      })
    })
  },
  toJSON() {
    return JSON.stringify({
      uuid: this.uuid,
      gender: this.gender
    })
  },
  save() {
    store.Save(this.key, this.toJSON())
  },
  setGender(gender) {
    this.gender = gender
    this.save()
  },
  getGender() {
    return this.gender
  },
  getUUID() {
    return this.uuid
  }
})