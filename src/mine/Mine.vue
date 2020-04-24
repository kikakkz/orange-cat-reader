<template>
  <view class="container">
    <nb-tabs  class="container"
      :render-tab-bar="() => renderTabbar()" :initialPage="0"
      :page="currentPage" :locked=true>
      <nb-tab heading="~~" class="container">
        <MineHeader class="header" @setavatar="onSetAvatar" @idcopied="onIdCopied"
          :id="id" :gender="genderType"></MineHeader>
        <view class="brief-info">
          <touchable-opacity class="brief-info-left" :on-press="() => onMyTraceBook()">
            <view class="brief-info-left">
              <text class="brief-info-number">{{ likeBooksCount }}</text>
              <text class="brief-info-title">我的追书</text>
            </view>
          </touchable-opacity>
          <touchable-opacity class="brief-info-middle" :on-press="() => onMyReadHistory()">
            <view class="brief-info-middle">
              <text class="brief-info-number">{{ readBooksCount }}</text>
              <text class="brief-info-title">阅读历史</text>
            </view>
          </touchable-opacity>
          <view class="brief-info-right">
            <text class="brief-info-number">{{ readDurationMin }}
              <text class="brief-info-meter">{{ timeMeter }}</text>
            </text>
            <text class="brief-info-title">阅读时长</text>
          </view>
        </view>
        <view class="func">
          <touchable-opacity class="func-text-btn-container" :on-press="() => onAboutSoftware()">
            <text class="func-text-btn">关于橘猫</text>
            <image class="func-btn-img" :source="require('../icons/Go.png')"></image>
          </touchable-opacity>
          <touchable-opacity class="func-text-btn-container" :on-press="() => onAboutId()">
            <text class="func-text-btn">关于ID</text>
            <image class="func-btn-img" :source="require('../icons/Go.png')"></image>
          </touchable-opacity>
          <touchable-opacity class="func-text-btn-container" :on-press="() => onClearCache()">
            <text class="func-text-btn">缓存清理</text>
            <text class="func-text-size">{{ meteredSize }} {{ sizeMeter }}</text>
            <image class="func-btn-img" :source="require('../icons/Go.png')"></image>
          </touchable-opacity>
        </view>
      </nb-tab>
      <nb-tab heading="~~">
        <MineBookList ref="ReadHistory" :books="readBooks" :navigation="navigation"
          :itemHeight=100 @back="onBack" title="阅读历史"
          :style="{width: screenWidth, height: screenHeight}"
          @deleteall="onDeleteAllRead" @delete="onDeleteReadBook"
          @gotorecommend="onGotoRecommend"></MineBookList>
      </nb-tab>
      <nb-tab heading="~~">
        <MineBookList ref="LikedBooks" :books="likedBooks" :navigation="navigation"
          :itemHeight=100 @back="onBack" title="我的追书"
          :style="{width: screenWidth, height: screenHeight}"
          @deleteall="onDeleteAllLiked"  @delete="onDeleteLikedBook"
          @gotorecommend="onGotoRecommend"></MineBookList>
      </nb-tab>
      <nb-tab heading="~~">
        <MineAboutSoftware ref="AboutSoftware" @back="onBack" title="关于橘猫" cancelText=""
          :style="{width: screenWidth, height: screenHeight}"></MineAboutSoftware>
      </nb-tab>
      <nb-tab heading="~~">
        <MineAboutId ref="AboutId" @back="onBack" title="关于橘猫ID" cancelText=""
          :style="{width: screenWidth, height: screenHeight}"></MineAboutId>
      </nb-tab>
      <nb-tab heading="~~">
        <ConfirmDialog @cancel="onGenderMale" @confirm="onGenderFamale"
          @other="onGenderUnknow" @nothing="onGenderIgnore" :showMiddle=true
          leftText="男生" middleText="不确定" rightText="女生"
          hint="选择你喜欢的性别～～" ref="GenderSel" :respondBack=true
          :style="{width: screenWidth, height: screenHeight}"></ConfirmDialog>
      </nb-tab>
    </nb-tabs>
    <view class="hint" v-if="idCopied" :style="{width: screenWidth, height: screenHeight}">
      <view class="hint-container">
        <text class="hint-text">{{ id }}</text>
        <text class="hint-text">已经被复制到剪切板，请在其他输入界面使用～～</text>
      </view>
    </view>
    <view class="hint" v-if="cacheCleared" :style="{width: screenWidth, height: screenHeight}">
      <view class="hint-container">
        <text class="hint-text">阅读缓存已清理～～</text>
        <text class="hint-text">小提示：为了清理阅读缓存，需要将待清理的书籍从阅读历史和追书中删除哦～～</text>
      </view>
    </view>
  </view>
</template>
<script>
import React from 'react'
import { View } from 'react-native'

import { mine } from './mine-utils'
import MineHeader from './MineHeader'
import MineBookList from './MineBookList'
import MineAboutSoftware from './MineAboutSoftware'
import MineAboutId from './MineAboutId'
import ConfirmDialog from '../dialog/ConfirmDialog'
const { likedBooks, readHistory, clearingBooks } = require('../book/book-functions.js')
import { screenHeight, screenWidth, px2dp } from '../utils/screen-utils'
const { readerInfo } = require('../reader/reader-utils.js')

export default {
  props: ['navigation'],
  data () {
    return {
      likedBooks: [],
      readBooks: [],
      readHours: 0,
      historyPage: 1,
      traceBookPage: 2,
      aboutSoftwarePage: 3,
      aboutIdPage: 4,
      genderChangePage: 5,
      screenHeight: screenHeight,
      screenWidth: screenWidth,
      currentPage: 0,
      genderType: GenderUnknow,
      readDurationMin: 0,
      timeMeter: '分钟',
      idCopied: false,
      booksSize: 0,
      loading: false,
      cacheCleared: false,
      id: ''
    }
  },
  components: {
    MineHeader,
    MineBookList,
    MineAboutSoftware,
    MineAboutId,
    ConfirmDialog
  },
  created () {
    this.reload()
  },
  computed: {
    readBooksCount: function () {
      return this.readBooks.length
    },
    likeBooksCount: function () {
      return this.likedBooks.length
    },
    sizeMeter: function () {
      return this.booksSize < 1024 * 1024 ? 'KB' : 'MB'
    },
    meteredSize: function () {
      return this.booksSize < 1024 * 1024 ? this.booksSizeKB : this.booksSizeMB
    },
    booksSizeKB: function () {
      return Math.floor(this.booksSize / 1024 * 100) / 100
    },
    booksSizeMB: function () {
      return Math.floor(this.booksSize / 1024 / 1024 * 100) / 100
    }
  },
  methods: {
    onAboutSoftware: function () {
      this.currentPage = this.aboutSoftwarePage
      if (undefined != this.$refs.AboutSoftware) {
        this.$refs.AboutSoftware.enter()
      }
    },
    onAboutId: function () {
      this.currentPage = this.aboutIdPage
      if (undefined != this.$refs.AboutId) {
        this.$refs.AboutId.enter()
      }
    },
    onClearCache: function () {
      var size = clearingBooks.clearAll()
      this.booksSize -= size
      this.cacheCleared = true
      setTimeout(() => {
        this.cacheCleared = false
      }, 1000)
    },
    onMyTraceBook: function () {
      this.currentPage = this.traceBookPage
      if (undefined != this.$refs.LikedBooks) {
        this.$refs.LikedBooks.enter()
      }
    },
    onDeleteAllLiked: function () {
      for (var i in this.likedBooks) {
        var book = this.likedBooks[i]
        likedBooks.delBook(book)
      }
      this.likedBooks = []
    },
    onDeleteLikedBook: function (book) {
      likedBooks.delBook(book)
    },
    onMyReadHistory: function () {
      this.currentPage = this.historyPage
      if (undefined != this.$refs.ReadHistory) {
        this.$refs.ReadHistory.enter()
      }
    },
    onDeleteAllRead: function () {
      for (var i in this.readBooks) {
        var book = this.readBooks[i]
        readHistory.delBook(book)
        clearingBooks.addBook(book)
      }
    },
    onDeleteReadBook: function (book) {
      readHistory.delBook(book)
      clearingBooks.addBook(book)
    },
    onBack: function () {
      this.currentPage = 0
    },
    renderTabbar: function () {
      return (<View style={{height: 0}}></View>)
    },
    reset: function () {
      this.currentPage = 0
      this.reload()
    },
    reload: function () {
      if (this.loading) {
        return
      }

      this.loading = true
      this.booksSize = 0

      mine.load()
      .then((info) => {
        this.genderType = info.getGender()
        if (!this.genderType) {
          this.genderType = GenderUnknow
        }
        this.id = info.getUUID()
      })

      readHistory.load()
      .then((books) => {
        this.readBooks = books
        for (var i in books) {
          books[i].bookState().load()
          .then((stat) => {
            this.booksSize += stat.dataStoredSize()
          })
        }
        this.loading = false
      })

      likedBooks.load()
      .then((books) => {
        this.likedBooks = books
      })

      readerInfo.load()
      .then((info) => {
        var mins = info.getTotalReadMins()
        var scale = 100
        if (600 < mins) {
          scale = 1
        }
        if (60 < mins) {
          this.timeMeter = '小时'
          mins /= 60
        }
        this.readDurationMin = Math.floor(mins * scale) / scale
      })

      clearingBooks.load()
    },
    onSetAvatar: function () {
      this.currentPage = this.genderChangePage
      if (undefined != this.$refs.GenderSel) {
        this.$refs.GenderSel.enter()
      }
    },
    onGenderFamale: function () {
      this.currentPage = 0
      this.genderType = GenderGirl
    },
    onGenderMale: function () {
      this.currentPage = 0
      this.genderType = GenderBoy
    },
    onGenderUnknow: function () {
      this.currentPage = 0
      this.genderType = GenderUnknow
    },
    onGenderIgnore: function () {
      this.currentPage = 0
    },
    onGotoRecommend: function () {
      this.$emit('gotorecommend')
    },
    onIdCopied: function () {
      this.idCopied = true
      setTimeout(() => {
        this.idCopied = false
      }, 1000)
    }
  },
  watch: {
    genderType: function () {
      mine.setGender(this.genderType)
    }
  }
}
</script>
<style scoped>
.container {
  background-color: #f0f0f0;
}
.header {
  height: 80;
  padding: 10;
}
.brief-info {
  height: 80;
  background-color: orange;
  border-radius: 8;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 20;
  margin: 10;
}
.brief-info-number {
  color: black;
  font-size: 24;
  font-weight: bold;
  line-height: 28;
  text-align: center;
}
.brief-info-title {
  font-size: 10;
  line-height: 12;
  text-align: center;
}
.brief-info-left {
  flex: 1;
}
.brief-info-middle {
  flex: 1.2;
  border-right-color: white;
  border-right-width: 1px;
  border-left-color: white;
  border-left-width: 1px;
}
.brief-info-right {
  flex: 1;
}
.brief-info-meter {
  font-size: 8;
}
.func {
  margin-top: 40;
  padding-left: 20;
  padding-right: 20;
  background-color: white;
}
.func-text-btn {
  flex: 1;
  font-size: 13;
  color: black;
  line-height: 40;
  border-bottom-color: #f0f0f0;
  border-bottom-width: 1px;
}
.func-text-btn-container {
  flex-direction: row;
  align-items: center;
}
.func-btn-img {
  width: 10;
  height: 10;
}
.hint {
  position: absolute;
  justify-content: center;
}
.hint-text {
  color: white;
  font-size: 12;
  line-height: 18;
  text-align: center;
}
.hint-container {
  justify-content: center;
  height: 80;
  margin: 20;
  border-radius: 8;
  background-color: rgba(0, 0, 0, 0.5);
}
.func-text-size {
  font-size: 10;
}
</style>
