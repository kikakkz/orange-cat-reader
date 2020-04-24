<template>
  <view class="container">
    <scroll-view class="book-list" v-if="0 < books.length">
      <view v-for="(book, index) in books" :key="index" >
        <ScoreBulletinBook :navigation="navigation"
          :height="bookItemHeight" :book="book"></ScoreBulletinBook>
        <view class="book-func">
          <view class="chapter-hint">
            <text class="new-chapter-hint chapter-hint">最新章节:{{ book.latestChapterTitle() }}</text>
            <text class="last-chapter-hint chapter-hint">上次阅读:{{ book.bookState().getLastReadChapterTitle() }}</text>
          </view>
          <text class="stop-button" :on-press="() => onRemoveTrace(index)">停止追书</text>
        </view>
      </view>
    </scroll-view>
    <text v-if="0 == books.length" class="hint" :on-press="() => onHintPress()">
      没有感兴趣的书？点我发现精彩世界～～
    </text>
  </view>
</template>
<script>
import ScoreBulletinBook from '../bulletin/ScoreBulletinBook'
const { likedBooks } = require('../book/book-functions')
import { px2dp } from '../utils/screen-utils'
const { api } = require('../api/api')
 
export default {
  props: ['navigation'],
  data () {
    return  {
      books: [],
      bookItemHeight: px2dp(120),
      loading: false
    }
  },
  components: {
    ScoreBulletinBook
  },
  created () {
    this.enter()
  },
  methods: {
    enter: function () {
      if (this.loading) {
        return
      }

      this.loading = true
      this.books = []

      likedBooks.load()
      .then((books) => {
        this.books = books
        this.loading = false
      })
    },
    onRemoveTrace: function (index) {
      var book = this.books[index]
      likedBooks.delBook(book)
    },
    onHintPress: function () {
      this.$emit('gotorecommend')
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
  padding: 10;
}
.book-list {
  flex: 1;
}
.book-container {
  flex: 1;
}
.book-item {
  padding-top: 10;
  padding-bottom: 10;
  background-color: white;
}
.book-func {
  flex-direction: row;
  margin-top: 5;
  margin-bottom: 10;
}
.hint {
  align-self: stretch;
  line-height: 50;
  font-size: 14;
  justify-content: center;
  text-align: center;
  background-color: #a5a5a5;
}
.chapter-hint {
  flex: 1;
  font-size: 10;
}
.new-chapter-hint {
  color: red;
}
.last-read-hint {
  color: black;
}
.stop-button {
  font-size: 10;
  color: orange;
  font-weight: bold;
  border-color: orange;
  border-width: 2px;
  border-radius: 4;
  padding-left: 5;
  padding-right: 5;
  height: 15;
}
</style>
