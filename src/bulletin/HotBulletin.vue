<template>
  <view class="bulletin-container" v-if="readyToShow">
    <view class="title-bar">
      <BulletinTitle class="clazz-title" :title="title"></BulletinTitle>
      <view class="func-btn">
        <touchable-opacity class="func-btn-img-container" :on-press="() => onGo()">
          <image class="func-btn-img" :source="require('../icons/Go.png')"></image>
        </touchable-opacity>
      </view>
    </view>
    <view class="bulletin-row-container"
      v-for="(booksRow, row) in booksByRow" :key="row">
      <touchable-opacity
        :class="['bulletin-book-container', 0 == index ? 'bulletin-book-left' : 'bulletin-book-right']"
        v-for="(book, index) in booksRow" :key="index" :on-press="() => onItemPress(book)">
        <image :source="{uri: book.coverUri()}" class="bulletin-book-cover"
          :style="{resizeMode: 'stretch', width: coverHeight * 3 / 4, height: coverHeight}"></image>
        <view class="bulletin-book-text-area">
          <text class="bulletin-book-title">{{ book.name() }}</text>
          <view class="bulletin-book-sub-info">
            <text class="bulletin-book-clazz bulletin-book-sub-info-text">{{ book.clazzName() }}</text>
            <text class="bulletin-book-score bulletin-book-sub-info-text">{{ book.score() }}</text>
          </view>
        </view>
      </touchable-opacity>
    </view>
  </view>
</template>
<script>
import { px2dp } from '../utils/screen-utils'
import BulletinTitle from './BulletinTitle'
const { api } = require('../api/api.js')
const { bookOp } = require('../book/book-functions.js')

export default {
  props: ['title', 'navigation'],
  data () {
    return {
      totalBooks: 6,
      rowBooks: 2,
      titleHeight: 0,
      books: [],
      coverHeight: 120
    }
  },
  components: {
    BulletinTitle
  },
  created () {
    api.booksByClazzPageQuery(this.title, 1, '')
    .then((res) => {
      var data = api.parseApiResponse(res)
      if (null === data) {
        console.error(res)
        return
      }
      if (0 != data.code) {
        console.error(data.error)
        return
      }
      this.books = bookOp.booksFromApiResponse(data)
    })
  },
  methods: {
    onTitleLayout: function (e) {
      this.titleHeight = e.nativeEvent.layout.height
    },
    onItemPress: function (book) {
      this.navigation.navigate('Reader', {book: book})
    },
    onGo: function () {
      this.navigation.navigate('BulletinBookList',
        {books: this.books, clazz: this.title, page: 2, title: this.title})
    }
  },
  computed: {
    readyToShow: function () {
      return 0 < this.books.length
    },
    booksByRow: function () {
      var books = []
      var rowBooks = []
      var rowCount = 0

      for (var i = 0, count = 0; i < this.books.length && count < this.totalBooks; i++) {
        if (rowCount < this.rowBooks) {
          rowBooks.push(this.books[i])
        }
        rowCount += 1
        if (this.rowBooks <= rowCount) {
          books.push(rowBooks)
          rowBooks = []
          rowCount = 0
        }
        count += 1
      }
      if (0 < rowBooks.length && count < this.totalBooks) {
        books.push(rowBooks)
      }
      return books
    }
  }
}
</script>
<style scoped>
.bulletin-container {
  background-color: transparent;
  padding: 10;
}
.bulletin-row-container {
  flex-direction: row;
}
.bulletin-book-cover {
  background-color: transparent;
  margin-right: 10;
}
.bulletin-book-container {
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
  align-self: stretch;
  margin-top: 5;
  margin-bottom: 5;
}
.bulletin-book-left {
  margin-right: 3;
}
.bulletin-book-rignt {
  margin-left: 3;
}
.bulletin-book-text-area {
  flex: 1;
}
.bulletin-book-title {
  flex: 1;
  font-size: 14;
  color: #2a2a2a;
}
.bulletin-book-clazz {
  font-size: 12;
  color: #5a5a5a;
}
.bulletin-book-score {
  font-size: 12;
  color: orange;
}
.bulletin-book-sub-info-text {
  margin-right: 5;
}
.bulletin-book-sub-info {
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 5;
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
