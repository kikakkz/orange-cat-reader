import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://118.31.3.109',
  timeout: 10000
})

export const api = new Object({
  bookReport: function (action, key, body) {
    return axiosInstance.post('/book', {
      action: action, key: key, body: body
    })
  },
  booksInfo: function () {
    return axiosInstance.get('/books')
  },
  booksSearch: function (key, page) {
    return axiosInstance.get('/books?a=s&c=' + key + '&p=' + page)
  },
  booksByClazz: function (clazz) {
    return axiosInstance.get('/books?a=l&c=' + clazz)
  },
  booksByClazzPageQuery: function (clazz, page, query) {
    if (query != '') {
      query = '&' + query
    }
    return axiosInstance.get('/books?a=l&c=' + clazz + '&p=' + page + query)
  },
  bookChapters: function (id, name, author) {
    return axiosInstance.get('/book?id=' + id +
      '&n=' + encodeURIComponent(name) +
      '&au=' + encodeURIComponent(author) + 
      '&a=ch')
  },
  parseApiResponse: function (res) {
    if (res.status != 200) {
      return null
    }
    if (res.data === undefined || res.data === null) {
      return null
    }
    return res.data
  },
  readBlobAsText: function (blob, encoding) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = event => {
        resolve(fr.result)
      }
      fr.onerror = err => {
        reject(err)
      }
      fr.readAsText(blob, encoding)
    })
  },
  getBookChapter: function (url, charset='gbk') {
    return new Promise((resolve, reject) => {
      fetch(url)
      .then(async (res) => {
        if (res.status != 200) {
          reject('Network error(' + res.status + ')')
          return
        }
        if (charset === 'utf-8') {
          try {
            const text = await res.text()
            resolve(text)
          }
          catch (e) {
            reject(e)
          }
        }
        res.blob()
        .then((blob) => {
          this.readBlobAsText(blob, charset)
          .then((text) => {
            resolve(text)
          })
          .catch((e) => {
            reject(e)
          })
        })
        .catch((e) => {
          reject(e)
        })
      })
      .catch((e) => {
        reject(e)
      })
    })
  }
})