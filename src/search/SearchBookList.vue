<template>
  <view class="container">
    <CommonHeader title="书籍搜索" cancelText="" @back="onBack"></CommonHeader>
    <SearchBar class="search-bar" @search="onSearch"
      :initialText="searchText" :placeHolder="placeHolder"></SearchBar>
    <nb-tabs class="container"
      :render-tab-bar="() => renderTabbar()" :initialPage="0"
      :page="currentTabIndex" :locked=true>
      <nb-tab heading="~~" class="container">
        <view class="hot-book-container">
          <text class="hot-title">书籍热搜</text>
          <view v-for="(book, index) in hotBooks" :key="index" class="hot-book">
            <touchable-opacity class="hot-book-btn" :on-press="() => onBookPress(book)">
              <text class="hot-book-index hot-book-normal"
                :style="{backgroundColor: indexColors[index % indexColors.length]}">
                {{ index }}
              </text>
              <text class="hot-book-normal hot-book-name">{{ book.name() }}</text>
              <text class="hot-book-normal hot-book-author">{{ book.author() }}</text>
            </touchable-opacity>
          </view>
        </view>
        <view  class="hot-word-container">
          <text class="hot-title">关键词热搜</text>
          <view class="hot-words">
            <text v-for="(word, index) in hotWords" :key="index"
              class="hot-word key-word" :on-press="() => onKeyWordPress(word)"
              :style="{backgroundColor: wordColors[index % wordColors.length]}">
              {{ word }}
            </text>
          </view>
        </view>
        <view class="hot-word-container">
          <view class="histroy-title-bar">
            <text class="hot-title history-title">搜索历史</text>
            <view class="history-btn">
              <touchable-opacity class="func-btn-img-container" :on-press="() => onClearHistory()">
                <image class="func-btn-img" :source="require('../icons/DeleteAll.png')"></image>
              </touchable-opacity>
            </view>
          </view>
          <view class="hot-words">
            <text v-for="(word, index) in searchWords" :key="index"
              class="search-word key-word" :on-press="() => onKeyWordPress(word)">
              {{ word }}
            </text>
          </view>
        </view>
      </nb-tab>
      <nb-tab heading="~~" class="container">
        <view class="search-list">
          <text v-if="0 <= totalCount" class="search-abbreviation">共{{ totalCount }}个搜索结果~~</text>
          <scroll-view class="book-container"
            :on-momentum-scroll-end="(e) => onScrollEnd(e)">
            <template v-for="(book, index) in books">
              <ScoreBulletinBook :navigation="navigation" class="good-book-recommend"
                :key="index" :height="100" :book="book"></ScoreBulletinBook>
            </template>
            <text class="all-loaded" v-if="allGoodBooksLoaded">已经加载所有书籍~~ </text>
            <activity-indicator v-if="loadingNewBook" size="large" color="orange"></activity-indicator>
          </scroll-view>
        </view>
      </nb-tab>
    </nb-tabs>
    <view class="page-loading" :style="{height: screenHeight, width: screenWidth}">
      <activity-indicator v-if="loadingPage" size="large" color="orange"></activity-indicator>
    </view>
  </view>
</template>
<script>
import React from 'react'
import CommonHeader from '../utils/CommonHeader'
import ScoreBulletinBook from '../bulletin/ScoreBulletinBook'
const { api } = require('../api/api.js')
const { bookOp } = require('../book/book-functions.js')
const { search } = require('./search-utils.js')
import SearchBar from '../utils/SearchBar'
import { screenWidth, screenHeight } from '../utils/screen-utils'
import { BackHandler } from 'react-native'
import { View } from 'react-native'

export default {
  props: ['navigation'],
  data () {
    return {
      currentPage: 1,
      searchText: this.navigation.state.params.searchText,
      allGoodBooksLoaded: false,
      loadingNewBook: false,
      books: [],
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      loadingPage: false,
      totalCount: -1,
      hotWords: [],
      hotBooks: [],
      hotBooksCount: 4,
      indexColors: ['red', 'orange', 'violet', 'purple'],
      wordColors: ['teal', 'orange', 'purple', 'blue', 'red', 'violet'],
      currentTabIndex: 0,
      placeHolder: this.navigation.state.params.searchText,
      searchWords: []
    }
  },
  created () {
    search.load()
    .then((v) => {
      this.searchWords = v.getSearchWords()
    })
    .catch((e) => {
      console.log(e)
    })

    api.booksInfo()
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
      this.hotWords = data.body.hot_words
    })
    api.booksByClazz('searches')
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
      var books = bookOp.booksFromApiResponse(data)
      this.hotBooks = books.slice(0, this.hotBooksCount)
    })
    if (undefined != this.searchText && 0 < this.searchText.length) {
      this.loadingPage = true
      this.searchBooks(this.searchText)
    }
  },
  components: {
    CommonHeader,
    ScoreBulletinBook,
    SearchBar
  },
  mounted () {
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
  },
  beforeDestroy () {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
  },
  methods: {
    onHardwareBackPress: function () {
      if (0 != this.currentTabIndex) {
        this.searchText = ''
        this.currentTabIndex = 0
        return true
      }
      return false
    },
    renderTabbar: function () {
      return (<View style={{height: 0}}></View>)
    },
    onClearHistory: function () {
      search.clearAll()
      this.searchWords = []
    },
    onBookPress: function (book) {
      this.navigation.navigate('Reader', {book: book})
    },
    onKeyWordPress: function (text) {
      this.onSearch(text)
    },
    onBack: function () {
      this.navigation.goBack()
    },
    onSearch: function (text) {
      this.placeHolder = text

      if (text === this.searchText) {
        return
      }
      this.searchText = text
      this.allGoodBooksLoaded = false
      this.currentPage = 1
      this.loadingPage = true
      this.books = []

      search.addSearchWord(text)
      this.searchBooks(text)
    },
    onScrollEnd: function (e) {
      if (e.nativeEvent.contentSize.height - 20 <= e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height) {
        if (this.allGoodBooksLoaded) {
          return
        }
        this.loadingNewBook = true
        this.searchBooks(this.searchText)
      }
    },
    searchBooks: function (text) {
      api.booksSearch(text, this.currentPage)
      .then((res) => {
        this.loadingNewBook = false
        this.loadingPage = false
        var data = api.parseApiResponse(res)
        if (null === data) {
          console.error(res)
          return
        }
        if (0 != data.code) {
          console.error(data.error)
          return
        }

        if (1 == this.currentPage) {
          this.totalCount = data.body.total_count
        }

        var books = bookOp.booksFromApiResponse(data)
        this.books = this.books.concat(books)
        this.currentTabIndex = 1

        if (0 == books.length) {
          this.allGoodBooksLoaded = true
        } else {
          this.currentPage += 1
        }
      })
      .catch((e) => {
        console.log(e)
        this.loadingPage = false
        this.loadingNewBook = false
      })
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
  background-color: #f0f0f0;
}
.book-container {
  margin-left: 10;
  margin-right: 10;
  flex: 1;
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
.search-bar {
  margin-top: 10;
  margin-left: 10;
  margin-right: 10;
}
.hot-title {
  font-size: 10;
  line-height: 26;
  color: #5a5a5a;
  width: 100%;
}
.hot-book-container {
  padding: 10;
  background-color: white;
}
.page-loading {
  position: absolute;
  justify-content: center;
}
.search-abbreviation {
  text-align: center;
  line-height: 20;
  font-size: 10;
  color: #5a5a5a;
}
.hot-book {
  flex-direction: row;
}
.hot-book-index {
  border-radius: 4;
  width: 20;
  text-align: center;
  color: white;
  font-weight: bold;
}
.hot-book-normal {
  margin: 5;
  line-height: 20;
}
.hot-book-author {
  font-size: 10;
  color: black;
}
.hot-book-name {
  font-size: 12;
  flex: 1;
}
.hot-word-container {
  background-color: white;
  margin-top: 20;
  padding: 10;
}
.hot-words {
  flex-direction: row;
  flex-wrap: wrap;
}
.key-word {
  margin: 5;
  padding: 5;
  border-radius: 4;
  font-size: 10;
  line-height: 12;
}
.hot-word {
  color: white;
}
.search-word {
  border-color: orange;
  border-width: 1;
  color: black;
}
.hot-book-btn {
  flex-direction: row;
  flex: 1;
}
.search-list {
  flex: 1;
}
.histroy-title-bar {
  flex-direction: row;
}
.history-title {
  flex: 1;
}
.history-btn {
  flex: 1;
  align-items: flex-end;
}
.func-btn-img-container {
  width: 26;
  height: 26;
  padding: 3;
  flex: 1;
}
.func-btn-img {
  width: 20;
  height: 20;
}
</style>
