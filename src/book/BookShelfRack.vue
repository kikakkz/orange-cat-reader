<template>
  <view class="container" :on-layout="(e) => onRackLayout(e)">
    <scroll-view>
      <BooksCardRow :navigation="navigation" v-for="(books, index) in booksByRow"
        :key="index" :books="books" @booklongpress="onBookLongPress" :waitSelecting="waitSelecting"
        :allSelected="allSelected" @selected="onSelected"></BooksCardRow>
    </scroll-view>
  </view>
</template>
<script>
import React from 'react'
import BooksCardRow from './BooksCardRow'
import { EvBookLongPress } from './book-event'
import { bookShelf } from './book-functions'

export default {
  props: {
    navigation: Object
  },
  data() {
    return {
      booksByRow: [],
      books: [],
      allSelected: false,
      waitSelecting: false,
      booksWaitForOperate: [],
      rowBooks: 3
    }
  },
  components: {
    BooksCardRow
  },
  methods: {
    addBooks: function(books) {
      var booksByRow = new Array()
      for (var i in books) {
        var rowIdx = Math.floor(i / this.rowBooks)
        if (0 == i % this.rowBooks) {
          booksByRow[rowIdx] = new Array();
        }
        booksByRow[rowIdx].push(books[i])
      }
      this.booksByRow = booksByRow
      this.books = books
    },
    onBookLongPress: function (obj) {
      this.$emit(EvBookLongPress)
      this.booksWaitForOperate[obj.book.bookKey()] = obj
      this.waitSelecting = true
      this.allSelected = false
    },
    onSelected: function (obj) {
      if (!obj.selected) {
        this.booksWaitForOperate[obj.book.bookKey()] = undefined
      } else {
        this.booksWaitForOperate[obj.book.bookKey()] = obj
      }
    },
    onRackLayout: function (e) {
      this.$emit('on-layout', e)
    },
    selectAll: function (selected) {
      this.allSelected = selected
      for (var i in this.books) {
        var book = this.books[i]
        this.booksWaitForOperate[book.bookKey()] = {book: book, obj: this}
      }
    },
    delete: function () {
      var books = []
      for (var i in this.books) {
        var book = this.books[i]
        if (this.booksWaitForOperate[book.bookKey()] != undefined) {
          bookShelf.delBook(book)
          continue
        }
        books.push(book)
      }
      this.addBooks(books)
      this.booksWaitForOperate = {}

      this.allSelected = false
      this.waitSelecting = false
    },
    operateDone: function () {
      this.booksWaitForOperate = {}
      this.allSelected = false
      this.waitSelecting = false
    }
  }
}
</script>
<style scoped>
.container {
  padding-left: 5;
  padding-right: 5;
}
</style>
