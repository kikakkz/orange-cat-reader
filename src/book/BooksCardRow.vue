<template>
  <view class="book-card-row">
    <view v-for="(book, index) in rowBooks" :key="index" class="book-container">
      <BookCardMain :navigation="navigation" class="book-card" :waitSelecting="waitSelecting"
        :book="book" @booklongpress="onBookLongPress" @selected="onSelected"
        :selected="allSelected" v-if="!book.fakeBook" :showBookName="true"></BookCardMain>
      <text class="book-recommend" v-if="!book.fakeBook && book.bookState().recommendAtFirstPage()">推荐</text>
    </view>
  </view>
</template>
<script>
import BookCardMain from '../book/BookCardMain'
import { EvBookLongPress, EvSelected } from './book-event'
import { screenWidth } from '../utils/screen-utils'

export default {
  props: {
    books: Array,
    navigation: Object,
    allSelected: false,
    waitSelecting: false
  },
  data () {
    return {
      rowWidth: screenWidth,
      rowBooks: this.books
    }
  },
  components: {
    BookCardMain
  },
  methods: {
    onBookLongPress: function (obj) {
      this.$emit(EvBookLongPress, obj)
      this.waitSelecting = true
    },
    onSelected: function (obj) {
      this.$emit(EvSelected, obj)
    }
  },
  watch: {
    books: function () {
      var rowBooks = []
      rowBooks = rowBooks.concat(this.books)
      for (var i = rowBooks.length; i < 3; i++) {
        rowBooks = rowBooks.concat({fakeBook: true})
      }
      this.allSelected = false
      this.waitSelecting = false
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
.book-recommend {
  position: absolute;
  background-color: orange;
  border-radius: 4;
  font-size: 10;
  color: white;
  margin: 5;
}
</style>