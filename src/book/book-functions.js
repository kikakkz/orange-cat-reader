const { px2dp } = require('../utils/screen-utils.js')
const { api } = require('../api/api.js')

export const bookOp = new Object({
  booksFromApiResponse: function (data) {
    var booksArray = []
    var books = data.body.books
    for (var i in books) {
      booksArray.push(new Book(books[i]))
    }
    return booksArray
  }
})

export class Page {
  constructor(content, pageIndex, hasContent=true) {
    this.content = content
    this.containTitle = (1 === pageIndex)
    this.pageIndex = pageIndex
  }
}

export class ChapterStatus {
  constructor(chapter) {
    this.downloaded = false
    this.chapter = chapter
  }
  downloadedStatus() {
    this.chapter.book.bookState().addDownloadChapter(this.chapter.chapterKey())
    return this.downloaded
  }
  setDownloaded(downloaded) {
    this.downloaded = downloaded
  }
}

const md5 = require('react-native-md5')
const { store } = require('../utils/store-utils.js')

export class Chapter {
  constructor(book, chapter) {
    this.chapter = chapter
    this.pages = []
    this.status = new ChapterStatus(this)
    this.book = book
    this.content = ''
    this.loaded = false
    this.paragraphStart = '        '
    this.startCharsExtra = 6
  }
  chapterPages() {
    return this.pages
  }
  formatToPages(fontSize, viewWidth, viewHeight, titleHeight) {
    const lineHeight = Math.ceil(px2dp(10) + fontSize)
    const lineChars = parseInt(viewWidth / fontSize)
    const lines = Math.floor(viewHeight / lineHeight)
    const chars = this.content.length
    var pageIndex = 1
    var offset = 0
    var curLines = 0
    var pageLines = 0
    var paragraphPos = 0
    var paragraphLines = 0
    var lineText = ''
    var lineEndPos = []
    var curLineEndPos = 0
    var lineLength = 0

    while (offset < chars) {
      pageLines = lines
      if (pageIndex === 1) {
        pageLines = Math.floor((viewHeight - titleHeight) / lineHeight)
      }

      var localOffset = offset
      while (curLines < pageLines && localOffset < chars) {
        var remainContent = this.content.substring(localOffset)
        var lineFeedPos = remainContent.indexOf('\n') + 1

        if (lineFeedPos == 0) {
          lineFeedPos = remainContent.length
        }
        
        paragraphPos = 0
        paragraphLines = 0
        lineEndPos = []

        while (paragraphPos < lineFeedPos) {
          lineText = remainContent.substring(paragraphPos, lineFeedPos)
          if (lineText.startsWith(this.paragraphStart)) {
            curLineEndPos = Math.min(lineFeedPos, paragraphPos + lineChars + this.startCharsExtra + 1)
          } else {
            curLineEndPos = Math.min(lineFeedPos, paragraphPos + lineChars + 1)
          }
          lineLength = curLineEndPos - paragraphPos
          lineText = lineText.substring(0, lineLength)

          var count = (lineText.match(/[“”]/g) || []).length
          var extraCount = 0

          if (count <= 2) {
            extraCount = count
          } else if (count <= 4) {
            extraCount = 3
          }

          curLineEndPos += extraCount
          curLineEndPos = Math.min(curLineEndPos, lineFeedPos)

          lineLength = curLineEndPos - paragraphPos
          lineText = lineText.substring(0, lineLength)
          if (lineText.endsWith('，')) {
            lineLength -= 2
          } else {
            if (lineChars <= lineLength) {
              if (lineText.endsWith('。')) {
                lineLength -= 2
              } else {
                lineLength -= 1
              }
            }
          }
          lineText = lineText.substring(0, lineLength)
          paragraphPos += lineLength
          lineEndPos[paragraphLines] = paragraphPos
          paragraphLines += 1
        }

        var lineFeedLines = Math.min(paragraphLines, pageLines - curLines)
        if (pageLines <= curLines + lineFeedLines) {
          localOffset += lineEndPos[lineFeedLines - 1]
          curLines = pageLines
          break
        }
        localOffset += lineFeedPos
        curLines += lineFeedLines
      }

      var page = new Page(this.content.substring(offset, localOffset), pageIndex)
      this.pages.push(page)

      offset = localOffset
      curLines = 0
      pageIndex += 1
    }

    return lineHeight
  }
  chapterStatus() {
    return this.status
  }
  pageCount() {
    return this.pages.length
  }
  chapterKey() {
    return md5.hex_md5(this.book.id() + '-' + this.index() + '-' + this.title())
  }
  loadFromStorage() {
    if (this.laoded) {
      return new Promise((resolve) => {
        resolve(this)
      })
    }
    return new Promise((resolve, reject) => {
      store.Load(this.chapterKey())
      .then((v) => {
        if (!v) {
          reject('Chapter is not stored')
          return
        }
        this.content = v
        this.loaded = true
        resolve(this)
      })
      .catch((e) => {
        reject(e)
      })
    })
  }
  saveToStorage() {
    store.Save(this.chapterKey(), this.content)
  }
  url(booksInfo) {
    var spec = booksInfo.contentSpec(this.book.id())
    var chapterPrefix = spec.chapterPrefix()
    return chapterPrefix + this.chapter.url
  }
  name() {
    return this.chapter.title
  }
  addContentStartEnd(content, spec) {
    var start = content.indexOf(spec.start())
    start += spec.start().length
    var text = content.substring(start)
    var end = text.indexOf(spec.end())
    text = content.substring(start, start + end)

    text = text.replace(/(&nbsp;)+/g, this.paragraphStart)
               .replace(/<br \/>/g, '')
               .replace(/<br\/>/g, '')

    return text
  }
  addContentSegment(content, spec) {
    var text = ''
    var pstart = 0
    var pend = 0
    var offset = 0
    var chars = content.length
    var startTag = spec.start()
    var endTag = spec.end()
    var subContent = content

    while (offset < chars) {
      subContent = content.substring(offset)
      pstart = subContent.indexOf(startTag)
      pend = subContent.indexOf(endTag)
      if (pstart < 0 || pend < 0) {
        return text
      }
      pstart += startTag.length
      text += this.paragraphStart
      text += subContent.substring(pstart, pend)
      text += '\r\n'
      offset += pend + endTag.length
    }
    return text
  }
  addContent(booksInfo, content) {
    var text = content
    var spec = booksInfo.contentSpec(this.book.id())

    switch (spec.paragraphType()) {
    case 'start_end':
      text = this.addContentStartEnd(content, spec)
      break
    case 'segment':
      text = this.addContentSegment(content, spec)
      break
    }
    this.content = text
    this.book.bookState().dataStored(text.length)
    this.saveToStorage()
  }
  title() {
    return this.chapter.title
  }
  index() {
    return this.chapter.native_id
  }
  firstChapter() {
    return this.index() === 1
  }
}

export class BookList {
  constructor(key) {
    this.key = key,
    this.books = []
    this.loaded = false
  }
  load() {
    if (this.loaded) {
      return new Promise((resolve) => {
        resolve(this.books)
      })
    }
    return new Promise((resolve, reject) => {
      store.Load(this.key)
      .then((books) => {
        if (!books) {
          resolve([])
          return
        }

        var objs = JSON.parse(books)

        var rs = []
        for (var i in objs) {
          rs.push(new Book(objs[i]))
        }
        this.books = rs
        resolve(this.books)
        this.loaded = true
      })
      .catch((e) => {
        reject(e)
      })
    })
  }
  toJSON() {
    var books = []
    for (var i in this.books) {
      books.push(this.books[i].book)
    }
    return JSON.stringify(books)
  }
  save() {
    store.Save(this.key, this.toJSON())
  }
  addBook(book) {
    for (var i in this.books) {
      if (book.bookKey() === this.books[i].bookKey()) {
        return
      }
    }
    this.books.push(book)
    this.save()
  }
  delBook(book) {
    for (var i in this.books) {
      if (book.bookKey() === this.books[i].bookKey()) {
        this.books.splice(i, 1)
        this.save()
        break
      }
    }
  }
  queryBook(book) {
    for (var i in this.books) {
      if (book.bookKey() === this.books[i].bookKey()) {
        return true
      }
    }
    return false
  }
}

export class BookShelf extends BookList {
  constructor() {
    super('BookShelf')
  }
  addBook(book) {
    super.addBook(book)
    book.bookState().inShelf = true
  }
  delBook(book) {
    super.delBook(book)
    book.bookState().inShelf = false
  }
}

export class LikedBooks extends BookList {
  constructor() {
    super('LikedBooks')
  }
  addBook(book) {
    super.addBook(book)
    book.bookState().liked = true
  }
  delBook(book) {
    super.delBook(book)
    book.bookState().liked = false
  }
}

export class ReadHistory extends BookList {
  constructor() {
    super('ReadList')
  }
  delBook(book) {
    super.delBook(book)
    book.bookState().clear()
  }
}

export const bookShelf = new BookShelf()
export const readHistory = new ReadHistory()
export const likedBooks = new LikedBooks()

export class ClearingBooks extends BookList {
  constructor() {
    super('ClearingBooks')
  }
  clearAll() {
    var size = 0
    for (var i in this.books) {
      size += this.books[i].bookState().dataStoredSize()
      this.books[i].bookState().clear()
    }
    this.books = []
    this.save()
    return size
  }
}

export const clearingBooks = new ClearingBooks()

export class BookStatus {
  constructor(book) {
    bookShelf.load()
    .then((v) => {
      this.inShelf = bookShelf.queryBook(this.book)
    })
    .catch((e) => {
      console.log(e)
    })

    likedBooks.load()
    .then((v) => {
      this.liked = likedBooks.queryBook(this.book)
    })
    .catch((e) => {
      console.log(e)
    })

    this.book = book
    this.reset()
    this.key = this.book.bookKey() + '_status'
    this.load()
  }
  reset() {
    this.recommendFirstPage = false
    this.lastReadChapterIndex = 0
    this.lastReadChapterTitle = '还未开始阅读~~'
    this.lastReadChapterPage = 0
    this.downloadChapters = []
    this.storeSize = 0
    this.lastReadChapterTitle = ''
  }
  dataStored(size) {
    this.storeSize += size
    this.save()
  }
  dataStoredSize() {
    return this.storeSize
  }
  setReadChapter(chapterIndex) {
    this.lastReadChapterTitle = this.book.chapterByIndex(chapterIndex).title()
    this.lastReadChapterIndex = chapterIndex
    this.save()
  }
  setReadPage(pageIndex) {
    this.lastReadChapterPage = pageIndex
    this.save()
  }
  setFirstPageRecommend(recommend) {
    this.recommendFirstPage = recommend
  }
  recommendAtFirstPage() {
    return this.recommendFirstPage
  }
  fromShelf() {
    return this.inShelf
  }
  addDownloadChapter(chapterKey) {
    if (this.downloadChapters.indexOf(chapterKey) < 0) {
      this.downloadChapters.push(chapterKey)
      this.save()
    }
  }
  toJSON() {
    return JSON.stringify({
      liked: this.liked,
      lastReadChapterIndex: this.lastReadChapterIndex,
      lastReadPage: this.lastReadChapterPage,
      downloadChapters: this.downloadChapters,
      storeSize: this.storeSize,
      lastReadChapterTitle: this.lastReadChapterTitle
    })
  }
  save() {
    store.Save(this.key, this.toJSON())
  }
  load() {
    return new Promise((resolve, reject) => {
      store.Load(this.key)
      .then((v) => {
        if (null == v) {
          resolve(this)
          return
        }
      
        var obj = JSON.parse(v)

        this.liked = v.liked
        this.lastReadChapterPage = obj.lastReadPage
        this.lastReadChapterIndex = obj.lastReadChapterIndex
        this.downloadChapters = obj.downloadChapters
        this.storeSize = obj.storeSize
        this.lastReadChapterTitle = obj.lastReadChapterTitle

        resolve(this)
      })
      .catch((e) => {
        reject(e)
      })
    })
  }
  chapterDownloaded(chapterKey) {
    return !(this.downloadChapters.indexOf(chapterKey) < 0)
  }
  getLastReadChapter() {
    return this.lastReadChapterIndex
  }
  getLastReadPage() {
    return this.lastReadChapterPage
  }
  getLastReadChapterTitle() {
    return this.lastReadChapterTitle
  }
  clear() {
    for (var i in this.downloadChapters) {
      store.Remove(this.downloadChapters[i])
    }
    store.Remove(this.key)
    this.reset()
    this.loaded = false
  }
}

export class Book {
  constructor(book) {
    this.book = book
    this.chapters = []
    this.bookStatus = new BookStatus(this)
  }
  abbreviation() {
    return this.book.abbreviation
  }
  coverUri() {
    return this.book.cover
  }
  name() {
    return this.book.name
  }
  id() {
    return this.book.id
  }
  clazzName() {
    if (!this.book.class || this.book.class === '') {
      return '未分类'
    }
    return this.book.class
  }
  score() {
    return this.book.score
  }
  author() {
    return this.book.author
  }
  status() {
    return this.book.finished ? '已完结' : '连载中...'
  }
  recommendWords() {
    if (this.book.rwords === null || this.book.rwords === undefined) {
      return '本书并非推荐图书'
    }
    return this.book.rwords
  }
  recommendUser() {
    if (this.book.ruser === null || this.book.ruser === undefined) {
      return '本书暂无人推荐'
    }
    return this.book.ruser
  }
  constructChapters(chapters) {
    var chs = []
    for (var i in chapters) {
      var chapter = new Chapter(this, chapters[i])
      chs.push(chapter)
      if (this.bookStatus.chapterDownloaded(chapter.index())) {
        chapter.chapterStatus().setDownloaded(true)
      }
    }
    this.chapters = chs
  }
  chapterByIndex(index) {
    return this.chapters[index]
  }
  chapterIndex(chapter) {
    return this.chapters.indexOf(chapter)
  }
  chapterCount() {
    return this.chapters.length
  }
  bookState() {
    return this.bookStatus
  }
  bookKey() {
    return md5.hex_md5(this.id() + '-' + this.name() + '-' + this.author())
  }
  getChapters() {
    return this.chapters
  }
  charset() {
    var spec = booksInfo.contentSpec(this.id())
    return spec.charset()
  }
  searches() {
    return this.book.total_searches
  }
  latestChapterTitle() {
    return this.book.last_chapter_title
  }
}

export class ContentSpec {
  constructor(spec) {
    this.spec = spec
  }
  host() {
    return this.spec.host
  }
  start() {
    return this.spec.start
  }
  end() {
    return this.spec.end
  }
  charset() {
    return this.spec.charset
  }
  chapterPrefix() {
    return this.spec.chapter_prefix
  }
  paragraphType() {
    return this.spec.ptype
  }
}

export const booksInfo = new Object({
  contentSpecs: [],
  booksCount: 0,
  clazzS: [],
  load() {
    return new Promise((resolve, reject) => {
      api.booksInfo()
      .then((v) => {
        var data = v.data
        if (data.code != 0) {
          reject(data.error)
          return
        }
        this.booksCount = data.body.count
        for (var i in data.body.content_spec) {
          this.contentSpecs.push(new ContentSpec(data.body.content_spec[i]))
        }
        this.clazzS = data.body.clazzs
        resolve(this)
      })
      .catch((e) => {
        reject(e)
      })
    })
  },
  contentSpec(bookId) {
    for (var i in this.contentSpecs) {
      if (bookId.indexOf(this.contentSpecs[i].host()) < 0) {
        continue
      }
      return this.contentSpecs[i]
    }
  }
})
