<template>
  <view class="container">
    <view class="title-bar">
      <BulletinTitle class="clazz-title" :title="title"></BulletinTitle>
      <view class="func-btn">
        <touchable-opacity class="func-btn-img-container" :on-press="() => onGo()">
          <image class="func-btn-img" :source="require('../icons/Go.png')"></image>
        </touchable-opacity>
      </view>
    </view>
    <BulletinBooksCardRow
      v-for="(books, row) in booksByRow"
      :key="row" :books="books" :navigation="navigation"
      ></BulletinBooksCardRow>
  </view>
</template>
<script>
import BulletinBooksCardRow from './BulletinBooksCardRow'
import BulletinTitle from './BulletinTitle'
const { api } = require('../api/api.js')
const { bookOp } = require('../book/book-functions.js')

var books = null

export default {
  props: ['title', 'navigation', 'clazz'],
  components: {
    BulletinBooksCardRow,
    BulletinTitle
  },
  data () {
    return {
      rowBooks: 4,
      bulletinLines: 2,
      booksByRow: [],
      books: []
    }
  },
  mounted () {
    if (null != books) {
      this.fromCache()
      return
    }
    this.getBooks()
  },
  methods: {
    onGo: function () {
      this.navigation.navigate('BulletinBookList',
        {books: this.books, clazz: this.clazz, page: 2, title: this.title})
    },
    addBooks: function(books) {
      var booksByRow = new Array()
      for (var i in books) {
        var rowIdx = Math.floor(i / this.rowBooks)
        if (this.bulletinLines <= rowIdx) {
          break
        }
        if (0 == i % this.rowBooks) {
          booksByRow[rowIdx] = new Array();
        }
        booksByRow[rowIdx].push(books[i])
      }
      this.booksByRow = booksByRow
      this.books = books
    },
    fromCache: function () {
      this.books = books
    },
    getRecommendBooks: function () {
      api.booksByClazzPageQuery(this.clazz, 1, '')
      .then((res) => {
        var data = api.parseApiResponse(res)
        if (null === data) {
          console.error('Error: ', res)
          return
        }
        if (data.code != 0) {
          console.error('Error: ', data.error)
          return
        }
        var books = bookOp.booksFromApiResponse(data)
        this.addBooks(books)
      })
      .catch((e) => {
        console.error(e)
      })
    },
    getBooks: function () {
      this.getRecommendBooks(GenderBoy, (books) => {
        this.$emit('books_ready', books)
      })
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
}
.clazz-title {
  flex: 1;
  margin-bottom: 10;
  margin-top: 10;
}
.title-bar {
  height: 50;
  flex-direction: row;
  align-items: flex-end;
}
.switch-container {
  width: 60;
  height: 28;
}
.func-btn {
  flex-direction: row;
  align-items: center;
}
.func-btn-img-container {
  width: 28;
  height: 28;
  padding: 9;
}
.func-btn-img {
  width: 10;
  height: 10;
}
</style>
