<template>
  <view class="book-shelf"  :on-layout="(e) => onRootLayout(e)">
    <BookShelfHeaderMenu ref="Header" :navigation="navigation" @addbook="onAddNewBook"></BookShelfHeaderMenu>
    <BookShelfRecomendCard :navigation="navigation" ref="BookRecomendCard" class="recomend-card"></BookShelfRecomendCard>
    <BookOperateMenu class="book-op-menu" v-if="operating" :toolbartop="toolbarTop"
      :style="{height: rootHeight, width: rootWidth}"
      @allselected="onAllSelected" @delete="onDelete" @close="onClose"></BookOperateMenu>
    <BookShelfRack :navigation="navigation" ref="BookShelfRack" @on-layout="(e) => onRackLayout(e)"
      class="book-shelf-rack" @booklongpress="onBookLongPress"></BookShelfRack>
  </view>
</template>
<script>
import BookShelfHeaderMenu from './BookShelfHeaderMenu'
import BookShelfRecomendCard from './BookShelfRecomendCard'
import BookShelfRack from './BookShelfRack'
import BookOperateMenu from './BookOperateMenu'
const { api } = require('../api/api')
const { bookOp } = require('./book-functions')
const { bookShelf } = require('../book/book-functions.js')

var onlineBooks = null
var directorRecommendBooks = null

export default {
  data () {
    return {
      books: [],
      onlineBooks: [],
      directorRecommendBooks: [],
      leastShelfBooks: 3,
      lineBooks: 3,
      operating: false,
      rootHeight: 0,
      rootWidth: 0,
      toolbarTop: 0
    }
  },
  props: {
    navigation: Object,
    booksOnShelf: 0
  },
  components: {
    BookShelfHeaderMenu,
    BookShelfRecomendCard,
    BookShelfRack,
    BookOperateMenu
  },
  mounted() {
    this.$on('books_ready', this.onBooks)
    this.$on('director_recommend_books', this.getDirectorCommendBooks)
    this.enter()
  },
  methods: {
    enter () {
      this.books = []
      this.createBooksOnShelf();
      this.$refs.Header.enter()
    },
    mergeBooks() {
      var count = 0;
      if (this.books.length < this.leastShelfBooks) {
        count = this.leastShelfBooks - this.books.length
      } else if (0 != this.books.length % this.lineBooks) {
        count = Math.ceil(this.books.length / this.lineBooks) * this.lineBooks - this.books.length
      }
      for (var i = 0, n = 0; i < this.onlineBooks.length && n < count; i++) {
        var duplicated = false
        for (var k = 0; k < this.books.length; k++) {
          if (this.onlineBooks[i].id() === this.books[k].id()) {
            duplicated = true
            break;
          }
        }
        if (duplicated) {
          continue
        }
        this.books = this.books.concat(this.onlineBooks[i])
        this.onlineBooks[i].bookState().setFirstPageRecommend(true)
        n += 1
      }
    },
    getBooks() {
      api.booksByClazz('shelfrecommend')
      .then(res => {
        var data = api.parseApiResponse(res)
        if (data.code != 0) {
          console.error(data.error, res.config.url)
          return
        }
        this.onlineBooks = bookOp.booksFromApiResponse(data)
        onlineBooks = this.onlineBooks
        this.$emit('director_recommend_books')
      })
      .catch((error) => {
        console.log(error, 'default books')
      })
    },
    getDirectorCommendBooks: function () {
      api.booksByClazz('directorrecommend')
      .then(res => {
        var data = api.parseApiResponse(res)
        if (data.code != 0) {
          console.error(data.error, res.config.url)
          return
        }
        this.directorRecommendBooks = bookOp.booksFromApiResponse(data)
        directorRecommendBooks = this.directorRecommendBooks
        this.$emit('books_ready')
      })
      .catch((error) => {
        console.log(error, 'director recommend books')
      })
    },
    onBooks() {
      this.mergeBooks()
      this.$refs.BookShelfRack.addBooks(this.books)
      this.$refs.BookRecomendCard.setRecomendBook(this.directorRecommendBooks[0])
    },
    createBooksOnShelfSync: function (books) {
      this.books = this.books.concat(books)
      if (onlineBooks != null) {
        this.onlineBooks = onlineBooks
        if (directorRecommendBooks === null) {
          this.$emit('director_recommend_books')
          return
        }
        this.directorRecommendBooks = directorRecommendBooks
        this.$emit('books_ready')
        return
      }
      this.getBooks()
    },
    createBooksOnShelf: function () {
      bookShelf.load()
      .then((v) => {
        this.createBooksOnShelfSync(v)
      })
      .catch((e) => {
        console.log(e)
      })
    },
    onBookLongPress: function () {
      this.operating = true
    },
    onRootLayout: function (e) {
      this.rootWidth = e.nativeEvent.layout.width
      this.rootHeight = e.nativeEvent.layout.height
    },
    onRackLayout: function (e) {
      this.toolbarTop = e.nativeEvent.layout.y - 80
    },
    onAllSelected: function (selected) {
      this.$refs.BookShelfRack.selectAll(selected)
    },
    onDelete: function () {
      this.operating = false
      this.$refs.BookShelfRack.delete()
    },
    onClose: function () {
      this.operating = false
      this.$refs.BookShelfRack.operateDone()
    },
    onAddNewBook: function () {
      this.$emit('gotorecommend')
    }
  }
}
</script>
<style scoped>
.book-shelf {
  background-color: #f0f0f0;
}
.recomend-card {
  flex: 3;
  padding-top: 10;
  padding-bottom: 10;
  margin-right: 10;
  margin-left: 10;
}
.book-shelf-rack {
  flex: 10;
}
.book-op-menu {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
