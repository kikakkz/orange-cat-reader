<template>
  <view class="container" :style="{backgroundColor: backgroundColor}">
    <ReaderPage class="reader-page" :page="layer0Page" :title="title" :chapterPages="pageCount"
      :nightMode="nightMode" @showmenu="onShowMenu" @nextpage="onNextPage" @prevpage="onPrevPage"
      :fontSize="fontSize" :lineHeight="lineHeight" :titleHeight="titleHeight" :layer=0
      :style="{height: screenHeight, width: screenWidth, zIndex: zLayer0}"></ReaderPage>
    <ReaderPage class="reader-page" :page="layer1Page" :title="title" :chapterPages="pageCount"
      :nightMode="nightMode" @showmenu="onShowMenu" @nextpage="onNextPage" @prevpage="onPrevPage"
      :fontSize="fontSize" :lineHeight="lineHeight" :titleHeight="titleHeight" :layer=1
      :style="{height: screenHeight, width: screenWidth, zIndex: zLayer1}"></ReaderPage>
  </view>
</template>
<script>
import React from 'react'
import { View } from 'react-native'
import ReaderPage from './ReaderPage'
import { Page } from '../book/book-functions'
import { screenWidth, screenHeight } from '../utils/screen-utils'

EvNextChapter = 'nextchapter'
EvPrevChapter = 'prevchapter'
EvChangePage = 'changepage'

export default {
  props: ['chapter', 'fontSize', 'lineHeight', 'startPage', 'titleHeight', 'abbreviation', 'bookName', 'author', 'nightMode'],
  data () {
    return {
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      currentPageIndex: 0,
      lowerPageIndex: 0,
      backgroundDayColor: rgb(0xc2, 0xb1, 0x94),
      backgroundNightColor: rgb(66, 70, 59),
      nightModeEnable: this.nightMode,
      zLayer0: 1,
      zLayer1: 0,
      zActive: 1
    }
  },
  methods: {
    renderTabbar: function () {
      return (<View style={{height: 0}}></View>)
    },
    onShowMenu: function () {
      this.$emit(EvShowMenu)
    },
    switchPage: function () {
      var zLayer1 = this.zLayer1;
      this.zLayer1 = this.zLayer0;
      this.zLayer0 = zLayer1
      if (this.initialPage <= this.currentPageIndex) {
        this.$emit(EvChangePage, this.currentPageIndex - this.initialPage)
      }
    },
    onNextPage: function () {
      if (this.currentPageIndex < this.pageCount - 1) {
        this.currentPageIndex += 1
        if (this.currentPageIndex < this.pageCount - 1) {
          this.lowerPageIndex = this.currentPageIndex + 1
        }
        this.switchPage()
        return
      }
      this.$emit(EvNextChapter)
    },
    onPrevPage: function () {
      if (0 < this.currentPageIndex) {
        this.currentPageIndex -= 1
        if (0 < this.currentPageIndex) {
          this.lowerPageIndex = this.currentPageIndex - 1
        }
        this.switchPage()
        return
      }
      this.$emit(EvPrevChapter)
    }
  },
  components: {
    ReaderPage
  },
  computed: {
    pages: function () {
      if (undefined === this.chapter || null === this.chapter) {
        return []
      }
      
      var allPages = []
      if (this.firstChapter) {
        var occupierPage = new Page('', this.chapter.pageCount() + 1, false)
        occupierPage.cover = true
        occupierPage.bookName = this.bookName
        occupierPage.author = this.author
        occupierPage.abbreviation = this.abbreviation
        allPages.push(occupierPage)
      }

      this.currentPageIndex = this.startPage + this.initialPage

      if (this.startPage + this.initialPage < this.chapter.pageCount() - 1) {
        this.lowerPageIndex = this.startPage + this.initialPage + 1
      } else {
        this.lowerPageIndex = this.startPage + this.initialPage
      }
      allPages = allPages.concat(this.chapter.chapterPages())

      return allPages
    },
    layer0Page: function () {
      if (this.zActive === this.zLayer0) {
        return this.pages[this.currentPageIndex]
      } else {
        return this.pages[this.lowerPageIndex]
      }
    },
    layer1Page: function () {
      if (this.zActive === this.zLayer1) {
        return this.pages[this.currentPageIndex]
      } else {
        return this.pages[this.lowerPageIndex]
      }
    },
    initialPage: function () {
      if (this.firstChapter && 0 < this.startPage) {
        return 1
      } else {
        return 0
      }
    },
    title: function () {
      if (undefined === this.chapter || null === this.chapter) {
        return '乘风破浪会有时'
      }
      return this.chapter.title()
    },
    pageCount: function () {
      if (!this) {
        return 0
      }
      return this.pages.length
    },
    firstChapter: function () {
      return this.chapter.firstChapter()
    },
    backgroundColor: function () {
      return this.nightMode ? this.backgroundNightColor : this.backgroundDayColor
    },
  }
}
</script>
<style scoped>
.container {
  flex: 1;
}
.reader-page {
  position: absolute;
}
</style>
