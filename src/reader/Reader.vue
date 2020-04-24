<template>
  <view class="container">
    <ReaderMain v-if="undefined != chapter && 0 < chapter.pageCount()"
      :style="{height: viewHeight, width: viewWidth}" :nightMode="nightMode"
      :chapter="chapter" class="reader-main" @showmenu="onShowMenu"
      @nextchapter="onGotoNextChapter" @prevchapter="onBackPrevChapter"
      @changepage="onChangePage" :startPage="chapterStartPage"
      :fontSize="fontSize" :lineHeight="lineHeight" :titleHeight="titleHeight"
      :abbreviation="abbreviation" :bookName="bookName" :author="author"></ReaderMain>
    <ReaderMenu v-if="menuDisplaying" ref="ReaderMenu"
      :style="{height: viewHeight - statusBarHeight, width: viewWidth, top: statusBarHeight}"
      class="reader-menu" @hidden="onMenuHide" @goback="onReaderQuit"
        :bookName="bookName" @downloadbook="onDownloadBook"
        @readmodeswitch="onReadModeSwitch" :chapters="chapters"
        @switchchapter="onSwitchChapter" @prevchapter="onGotoPrevChapter"
        @nextchapter="onGotoNextChapter" @like="onLikeBook" :likeBook="liked"
        :currentChapterIndex="currentReadChapter"
        :prevChapterTitle="prevChapterTitle" :nextChapterTitle="nextChapterTitle"
        :currentChapterTitle="undefined === chapter ? '' : chapter.title()"
        :status="bookStatus" :alreadyFinished="alreadyFinished"></ReaderMenu>
    <ConfirmDialog class="confirm-dialog" v-if="quiting"
      :style="{height: viewHeight, width: viewWidth}"
      @cancel="onConfirmCancel" @confirm="onConfirmed"
      @nothing="onConfirmNothing"
      hint="点击确定加入书架以方便下次阅读～～"></ConfirmDialog>
    <view class="page-loading" :style="{height: screenHeight, width: screenWidth}">
      <activity-indicator v-if="loading || switching" size="large" color="blue"></activity-indicator>
    </view>
    <view class="hint" v-if="hinting" :style="{width: screenWidth, height: screenHeight}">
      <view class="hint-container">
        <text class="hint-text">{{ hintText }}～～</text>
      </view>
    </view>
  </view>
</template>
<script>
const { booksInfo, readHistory, bookShelf, likedBooks } = require('../book/book-functions.js')
const { api } = require('../api/api.js')

import { StatusBar, BackHandler } from 'react-native'

import ReaderMenu from './ReaderMenu.vue'
import ConfirmDialog from '../dialog/ConfirmDialog'
import ReaderMain from './ReaderMain'
const { readerInfo } = require('./reader-utils.js')
import { screenWidth, screenHeight } from '../utils/screen-utils.js'
const { mine } = require('../mine/mine-utils.js')

export default {
  props: {
    book: Object,
    navigation: Object,
    fromNavigate: { type: Boolean, default: true }
  },
  components: {
    ReaderMenu,
    ConfirmDialog,
    ReaderMain
  },
  data () {
    return {
      readingBook: this.fromNavigate ? this.navigation.state.params.book : this.book,
      chapter: undefined,
      currentReadChapter: 0,
      currentDownloadChapter: 0,
      currentPage: 0,
      chapterStartPage: 0,
      prefetchChapters: 5,
      lineHeight: 0,
      fontSize: 18,
      viewWidth: screenWidth,
      viewHeight: screenHeight,
      firstChapterReady: true,
      titleHeight: 55 + StatusBar.currentHeight,
      footerHeaderHeight: 20,
      headerHeight: 20 + StatusBar.currentHeight,
      menuDisplaying: false,
      statusBarHeight: StatusBar.currentHeight,
      bookStatus: '连载中...',
      alreadyFinished: false,
      quiting: false,
      reading: false,
      switching: false,
      liked: false,
      nightMode: false,
      loading: false,
      screenHeight: screenHeight,
      screenWidth: screenWidth,
      hinting: false,
      hintText: '',
      retries: 5
    }
  },
  mounted () {
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
  },
  created () {
    this.$on('book_chapters_ready', this.onBookChapters)
    this.$on('book_chapter_req', this.onChapterRequest)
    this.$on('first_chapter_ready', this.onFirstChapter)
    this.$on('start_read', this.onStartRead)

    this.getChaptersWithBooksInfo()

    readerInfo.load().then((info) => {
      info.startRead()
    })
    bookShelf.load()

    this.currentPage = this.readingBook.bookState().getLastReadPage()
    this.chapterStartPage = this.currentPage
    this.currentReadChapter = this.readingBook.bookState().getLastReadChapter()

    mine.load()
    .then((info) => {
      api.bookReport('set', 'read', {'book_id': this.readingBook.id(), 'client_id': info.getUUID()})
      .then((res) => {
        var data = api.parseApiResponse(res)
        if (null == data || 0 != data.code) {
          console.log(res)
          return
        }
      })
    })

    readHistory.addBook(this.readingBook)
  },
  beforeCreate () {
    StatusBar.setHidden(true)
    StatusBar.setTranslucent(true)
  },
  beforeDestroy () {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
    StatusBar.setHidden(false)
    StatusBar.setTranslucent(false)
    readerInfo.stopRead()
  },
  methods: {
    getBookChapters: function () {
      this.loading = true

      api.bookChapters(this.readingBook.id(),
        this.readingBook.name(),
        this.readingBook.author())
      .then(res => {
        var data = api.parseApiResponse(res)
        if (data.code != 0) {
          console.log(data.error)
          return
        }
        var chapters = data.body.chapters
        this.$emit('book_chapters_ready', chapters)
      })
      .catch((error) => {
        this.loading = false
        console.log(error, this.readingBook.id())
      })
    },
    onBookChapters: function (chapters) {
      if (0 < chapters.length) {
        this.readingBook.constructChapters(chapters)
        this.$emit('start_read')
      }
    },
    downloadFinish: function () {
      return (this.currentDownloadChapter === this.readingBook.chapterCount() - 1)
    },
    tryPrefetchChapter: function (timeout) {
      if (this.downloadFinish()) {
        return
      }
      if (this.prefetchChapters < 0 ||
        this.currentDownloadChapter < this.currentReadChapter + this.prefetchChapters) {
        setTimeout(() => { this.$emit('book_chapter_req') }, timeout)
      }
    },
    incrementDownloadIndex: function () {
      if (this.currentDownloadChapter < this.readingBook.chapterCount() - 1) {
        this.currentDownloadChapter += 1
      }
    },
    requestChapter: function(chapter) {
      api.getBookChapter(chapter.url(booksInfo), this.readingBook.charset())
      .then(res => {
        chapter.addContent(booksInfo, res)
        chapter.chapterStatus().setDownloaded(true)

        // Save chapter content and status here

        if (!this.firstChapterReady) {
          this.$emit('first_chapter_ready')
          this.firstChapterReady = true
        }

        this.incrementDownloadIndex()
        this.tryPrefetchChapter(1000)
      })
      .catch((error) => {
        if (this.retries <= 0) {
          this.hintText = '服务器太忙了,请稍后在尝试吧~~'
          this.hinting = true
          this.loading = false
          this.retries = 5
          setTimeout(() => {
            this.hinting = false
            this.onReaderQuit()
          }, 1000)
          return
        }

        this.retries -= 1
        console.log(error, chapter.name(), chapter.url(booksInfo))
        this.tryPrefetchChapter(4000)
      })
    },
    onChapterRequest: function () {
      var curChapter = this.readingBook.chapterByIndex(this.currentDownloadChapter)
      if (curChapter.chapterStatus().downloadedStatus()) {
        this.incrementDownloadIndex()
        this.tryPrefetchChapter(1000)
        return
      }
      this.requestChapter(curChapter)
    },
    incrementChapter: function () {
      if (this.currentReadChapter < this.readingBook.chapterCount() - 1) {
        this.currentReadChapter += 1
        return true
      }
      return false
    },
    substractChapter: function () {
      if (0 < this.currentReadChapter) {
        this.currentReadChapter -= 1
        return true
      }
      return false
    },
    onChangePage: function (page) {
      this.currentPage = page
    },
    onMenuHide: function () {
      this.menuDisplaying = false
      StatusBar.setHidden(true)
    },
    onReaderQuit: function () {
      this.readingBook.bookState().setReadChapter(this.currentReadChapter)
      this.readingBook.bookState().setReadPage(this.currentPage)
      this.navigation.goBack()
    },
    onDownloadBook: function () {
      this.prefetchChapters = -1
    },
    onReadModeSwitch: function (nightModeEnable) {
      this.nightMode = nightModeEnable
    },
    onSwitchChapter: function (obj) {
      this.currentReadChapter = parseInt(obj.chapter)
      this.loadReadChapter(false)
      this.onMenuHide()
    },
    gotoPreviousChatper: function (reverse) {
      if (this.switching) {
        return
      }
      this.switching = true
      if (this.substractChapter()) {
        this.loadReadChapter(reverse)
        return true
      }
      this.switching = false
      return false
    },
    onBackPrevChapter: function () {
      this.gotoPreviousChatper(true)
    },
    onGotoPrevChapter: function () {
      this.gotoPreviousChatper(false)
    },
    onLikeBook: function (like) {
      this.liked = like
      if (like) {
        likedBooks.addBook(this.readingBook)
      } else {
        likedBooks.delBook(this.readingBook)
      }
    },
    gotoNextChapter: function () {
      if (this.switching) {
        return
      }
      this.switching = true
      if (this.incrementChapter()) {
        this.loadReadChapter(false)
        return true
      }
      this.switching = false
      return false
    },
    onGotoNextChapter: function () {
      this.gotoNextChapter()
    },
    onShowMenu: function () {
      this.menuDisplaying = true
      StatusBar.setHidden(false)
    },
    resetReadPage(reverse) {
      if (this.reading) {
        if (reverse) {
          this.currentPage = this.chapter.pageCount() - 1
        } else {
          this.currentPage = 0
        }
      }
      this.chapterStartPage = this.currentPage
    },
    loadReadChapter: function (reverse) {
      var curChapter = this.readingBook.chapterByIndex(this.currentReadChapter)
      curChapter.loadFromStorage()
      .then((chapter) => {
        var lineHeight = chapter.formatToPages(this.fontSize, this.viewWidth - 20,
          this.viewHeight - 20 - this.footerHeaderHeight * 2, this.titleHeight)

        this.chapter = chapter
        this.lineHeight = lineHeight
        this.resetReadPage(reverse)

        this.reading = true
        this.switching = false
        this.loading = false
      })
      .catch((e) => {
        this.currentDownloadChapter = this.currentReadChapter
        this.firstChapterReady = false
        this.$emit('book_chapter_req')
        console.log(e, curChapter.url(booksInfo))
        console.log('Download ', curChapter.url(booksInfo))
      })
    },
    onFirstChapter: function () {
      this.$emit('start_read')
    },
    onStartRead: function () {
      this.loadReadChapter(false)
    },
    onHardwareBackPress: function () {
      this.readingBook.bookState().setReadChapter(this.currentReadChapter)
      this.readingBook.bookState().setReadPage(this.currentPage)

      if (this.readingBook.bookState().fromShelf()) {
        return false
      }

      this.quiting = true;
      return true
    },
    onConfirmCancel: function () {
      this.onReaderQuit()
    },
    onConfirmed: function () {
      bookShelf.addBook(this.readingBook)
      this.onReaderQuit()
    },
    onConfirmNothing: function () {
      this.quiting = false
    },
    getChaptersWithBooksInfo: function () {
      booksInfo.load()
      .then((v) => {
        this.getBookChapters()
      })
      .catch((e) => {
        console.error('Error: get books info, retry')
        setTimeout(() => {
          this.getChaptersWithBooksInfo()
        }, 1000)
      })
    }
  },
  computed: {
    prevChapterTitle: function () {
      if (this.currentReadChapter === 0) {
        return '已经是第一章了~'
      }
      return this.readingBook.chapterByIndex(this.currentReadChapter - 1).name()
    },
    nextChapterTitle: function () {
      if (this.currentReadChapter === this.readingBook.chapterCount() - 1) {
        return '已经是最后一章了~'
      }
      return this.readingBook.chapterByIndex(this.currentReadChapter + 1).name()
    },
    abbreviation: function () {
      return this.readingBook.abbreviation()
    },
    bookName: function () {
      return this.readingBook.name()
    },
    author: function () {
      return this.readingBook.author()
    },
    chapters: function () {
      return this.readingBook.getChapters()
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
  background-color: #c2b194;
}
.reader-main {
  position: absolute;
}
.reader-menu {
  position: absolute;
  left: 0;
  top: 0;
}
.confirm-dialog {
  position: absolute;
  left: 0;
  top: 0;
}
.page-loading {
  position: absolute;
  justify-content: center;
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
</style>
