const { store } = require('../utils/store-utils')

export const search = new Object({
  key: 'Search',
  loaded: false,
  searchWords: [],
  load() {
    if (this.loaded) {
      return new Promise((resolve) => {
        resolve(this)
      })
    }
    return new Promise((resolve, reject) => {
      store.Load(this.key)
      .then((v) => {
        if (null == v) {
          resolve(this)
          return
        }

        var obj = JSON.parse(v)
        this.searchWords = obj.searchWords
        this.loaded = true
        resolve(this)
      })
      .catch((e) => {
        reject(e)
      })
    })
  },
  toJSON() {
    return JSON.stringify({
      searchWords: this.searchWords
    })
  },
  save() {
    store.Save(this.key, this.toJSON())
  },
  getSearchWords() {
    return this.searchWords
  },
  addSearchWord(word) {
    if (this.searchWords.indexOf(word) < 0) {
      this.searchWords.push(word)
      this.save()
      return
    }
  },
  clearAll() {
    this.searchWords = []
    this.save()
  }
})