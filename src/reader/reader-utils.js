const { store } = require('../utils/store-utils')
import { getCurrentWeekNo } from '../utils/date-utils'

export const readerInfo = new Object({
  weeklyReadMins: {},
  totalReadMins: 0,
  startReadMin: 0,
  key: 'ReaderInfo',
  loaded: false,

  load() {
    if (this.loaded) {
      return new Promise((resolve) => {
        resolve(this)
      })
    }
    return new Promise((resolve, reject) => {
      store.Load(this.key)
      .then((v) => {
        if (v) {
          var obj = JSON.parse(v)
          this.weeklyReadMins = obj.weeklyReadMins
          this.totalReadMins = obj.totalReadMins
        }
        if (!this.weeklyReadMins[this.weekKey()]) {
          this.weeklyReadMins[this.weekKey()] = {readMins: 0}
        }
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
      weeklyReadMins: this.weeklyReadMins,
      totalReadMins: this.totalReadMins
    })
  },
  save() {
    store.Save(this.key, this.toJSON())
  },
  startRead() {
    this.startReadMin = Math.floor(new Date() / (60 * 1000))
  },
  stopRead() {
    readDuration = Math.floor(new Date() / (60 * 1000)) - this.startReadMin
    this.totalReadMins += readDuration
    this.weeklyReadMins[this.weekKey()].readMins += readDuration
    this.save()
  },
  weekKey() {
    var weekNo = getCurrentWeekNo()
    var yearNo = new Date().getFullYear()
    return yearNo + '-' + weekNo
  },
  getWeeklyReadMins() {
    return this.weeklyReadMins[this.weekKey()].readMins
  },
  getTotalReadMins() {
    return this.totalReadMins
  }
})