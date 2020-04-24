<template>
  <view class="book-card-row">
    <view v-for="(book, index) in rowBooks" :key="index" class="book-container"
      :style="{width: cardWidth, height: cardHeight}">
      <BookCardMain :navigation="navigation" class="book-card" :waitSelecting=false
        :book="book" :selected=false v-if="!book.fakeBook" :operatable=false></BookCardMain>
      <text class="book-title" :style="{height: titleHeight, lineHeight: titleHeight}">
        {{ book.name() }}
      </text>
    </view>
  </view>
</template>
<script>
import BookCardMain from '../book/BookCardMain'
import { screenWidth } from '../utils/screen-utils'

export default {
  props: {
    books: Array,
    navigation: Object,
    rowBooksCount: {
      type: Number, default: 4
    }
  },
  data () {
    return {
      rowWidth: screenWidth,
      rowBooks: this.books,
      cardWidth: 0,
      cardHeight: 0,
      titleHeight: 20
    }
  },
  components: {
    BookCardMain
  },
  created () {
    this.cardWidth = this.rowWidth / this.rowBooksCount
    this.cardHeight = this.cardWidth * 4 / 3 + this.titleHeight
  },
  watch: {
    books: function () {
      var rowBooks = []
      rowBooks = rowBooks.concat(this.books)
      for (var i = rowBooks.length; i < this.rowBooksCount; i++) {
        rowBooks = rowBooks.concat({fakeBook: true})
      }
      this.rowBooks = rowBooks
    }
  }
}
</script>
<style scoped>
.book-card-row {
  flex: 1;
  flex-direction: row;
}
.book-container {
  flex: 1;
}
.book-card {
  flex: 1;
  margin: 5;
}
.book-title {
  font-size: 10;
  margin: 5;
}
</style>