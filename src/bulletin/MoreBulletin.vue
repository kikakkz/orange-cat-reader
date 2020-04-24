<template>
  <view class="container">
    <view class="title-bar">
      <text class="clazz-title">{{ title }}</text>
    </view>
    <template v-for="(book, index) in books">
      <ScoreBulletinBook :navigation="navigation" class="good-book-recommend"
        :key="index" :height="itemHeight" :book="book"></ScoreBulletinBook>
    </template>
    <activity-indicator v-if="loadingNewBook" size="large" color="orange"></activity-indicator>
    <text class="all-loaded" v-if="allGoodBooksLoaded">已经加载所有书籍~~ </text>
  </view>
</template>
<script>
const { api } = require('../api/api.js')
const { bookOp } = require('../book/book-functions.js')

import ScoreBulletinBook from './ScoreBulletinBook'
import OCRSwitch from '../utils/OCRSwitch'

var books = null

export default {
  props: ['itemHeight', 'navigation', 'title', 'clazz'],
  data () {
    return {
      loadingNewBook: false,
      allGoodBooksLoaded: false,
      books: [],
      currentPage: 1
    }
  },
  components: {
    ScoreBulletinBook,
    OCRSwitch
  },
  created () {
    this.$on('load_next_page', this.onLoadNextPage)
  },
  mounted () {
    if (null != books) {
      this.fromCache()
      return
    }
    this.getBooks()
  },
  methods: {
    loadNextPage: function () {
      if (this.allGoodBooksLoaded) {
        return
      }
      this.loadingNewBook = true
      this.$emit('load_next_page')
    },
    onLoadNextPage: function () {
      this.getRecommendBooks()
    },
    getRecommendBooks: function () {
      api.booksByClazzPageQuery(this.clazz, this.currentPage, '')
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
        this.books = this.books.concat(books)

        if (0 === books.length) {
          this.allGoodBooksLoaded = true
        } else {
          this.currentGoodBookPage += 1
        }

        this.loadingNewBook = false
      })
      .catch((e) => {
        console.error(e)
      })
    },
    getBooks: function () {
      this.getRecommendBooks('man', (books) => {
        this.$emit('male_books_ready', books)
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
  font-size: 20;
  font-weight: bold;
  color: black;
  margin: 10;
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
.good-book-recommend {
  margin: 5;
}
.all-loaded {
  height: 50;
  line-height: 50;
  font-size: 12;
  text-align: center;
}
</style>
