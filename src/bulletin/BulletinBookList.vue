<template>
  <view class="container">
    <CommonHeader :title="title" cancelText="" @back="onBack"></CommonHeader>
    <scroll-view class="book-container" :on-momentum-scroll-end="(e) => onScrollEnd(e)">
      <template v-for="(book, index) in books">
        <ScoreBulletinBook :navigation="navigation" class="good-book-recommend"
          :key="index" :height="100" :book="book"></ScoreBulletinBook>
      </template>
    </scroll-view>
    <activity-indicator v-if="loadingNewBook" size="large" color="orange"></activity-indicator>
    <text class="all-loaded" v-if="allGoodBooksLoaded">已经加载所有书籍~~ </text>
  </view>
</template>
<script>
import CommonHeader from '../utils/CommonHeader'
import ScoreBulletinBook from '../bulletin/ScoreBulletinBook'
const { api } = require('../api/api.js')
const { bookOp } = require('../book/book-functions.js')

export default {
  props: ['navigation'],
  data () {
    return {
      title: this.navigation.state.params.title,
      books: this.navigation.state.params.books,
      currentPage: this.navigation.state.params.page,
      gender: this.navigation.state.params.gender,
      bulletin: this.navigation.state.params.bulletin,
      clazz: this.navigation.state.params.clazz,
      allGoodBooksLoaded: false,
      loadingNewBook: false
    }
  },
  components: {
    CommonHeader,
    ScoreBulletinBook
  },
  methods: {
    onBack: function () {
      this.navigation.goBack()
    },
    onScrollEnd: function (e) {
      if (e.nativeEvent.contentSize.height - 20 <= e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height) {
        if (this.allGoodBooksLoaded) {
          return
        }
        this.loadingNewBook = true
        this.loadNextPage()
      }
    },
    loadNextPage: function () {
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
        
        if (0 === books.length) {
          this.allGoodBooksLoaded = true
        } else {
          this.currentGoodBookPage += 1
        }
        
        this.loadingNewBook = false
        this.books = this.books.concat(books)
      })
      .catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
}
.book-container {
  margin: 10;
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
