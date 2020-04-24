<template>
  <view class="container" :on-layout="(e) => { onRootLayout(e) }">
    <view class="container"
      :style="{width: rootWidth, height: rootHeight}">
      <view class="menu-body top-menu">
        <touchable-opacity class="top-menu-btn top-navi-back-btn" :on-press="() => onNaviBack()" >
          <image class="top-menu-btn top-navi-back-btn" :source="require('../icons/TitleBarNaviBack.png')"></image>
        </touchable-opacity>
        <touchable-opacity class="top-menu-text-btn-container" :on-press="() => onLikeBook()" >
          <text :class="['top-menu-text-btn', likeBook ? 'top-menu-text-btn-orange' : 'top-menu-text-btn-lightgray']">
            {{ likeBook ? '正在追书' : '添加追书' }}
          </text>
        </touchable-opacity>
        <touchable-opacity class="top-menu-text-btn-container" :on-press="() => onDownloadBook()" >
          <text class="top-menu-text-btn top-menu-text-btn-orange">全本下载</text>
        </touchable-opacity>
        <text class="top-menu-text">{{ bookName }}</text>
      </view>
      <text class="menu-occupier" :on-press="() => onHide()"></text>
      <OCRSlider class="menu-slider" v-if="brightnessAdjusting"
        :initialValue="brightnessPercent" @valuechanged="onBrightnessChanged"></OCRSlider>
      <text v-if="showMenuSetting" class="menu-setting-hint">
        橘猫阅读暂不支持其他设置设置～～
      </text>
      <view class="menu-body bottom-menu">
        <view class="bottom-menu-chapter-cruiser">
          <touchable-opacity class="chapter-item-container" :on-press="() => onPrevChapter()" >
            <text class="chapter-item chapter-item-index">上一章</text>
            <text class="chapter-item chapter-item-title">{{ prevChapterTitle }}</text>
          </touchable-opacity>
          <touchable-opacity class="chapter-item-container chapter-item-current" :on-press="() => onHide()" >
            <text class="chapter-item chapter-item-index">正在读</text>
            <text class="chapter-item chapter-item-title">{{ currentChapterTitle }}</text>
          </touchable-opacity>
          <touchable-opacity class="chapter-item-container" :on-press="() => onNextChapter()" >
            <text class="chapter-item chapter-item-index">下一章</text>
            <text class="chapter-item chapter-item-title">{{ nextChapterTitle }}</text>
          </touchable-opacity>
        </view>
        <view class="bottom-menu-func-btn">
          <touchable-opacity class="menu-func-container" :on-press="() => onBookContentTable()" >
            <image class="menu-func-image" :source="require('../icons/ContentTable.png')"></image>
            <text class="menu-func-text">目录</text>
          </touchable-opacity>
          <touchable-opacity class="menu-func-container" :on-press="() => onBrightness()" >
            <image class="menu-func-image" :source="require('../icons/Brightness.png')"></image>
            <text class="menu-func-text">亮度</text>
          </touchable-opacity>
          <touchable-opacity class="menu-func-container" :on-press="() => onReadModeSwitch()" >
            <image class="menu-func-image" :source="readModeIconUri"></image>
            <text class="menu-func-text">{{ readModeStr }}</text>
          </touchable-opacity>
          <touchable-opacity class="menu-func-container" :on-press="() => onSetting()" >
            <image class="menu-func-image" :source="require('../icons/Setting.png')"></image>
            <text class="menu-func-text">设置</text>
          </touchable-opacity>
        </view>
      </view>
    </view>
    <view class="content-table-container" v-if="contentTableDisplaying"
      :style="{width: rootWidth, height: rootHeight}">
      <view class="content-table">
        <text class="ct-bookname">{{ bookName }}</text>
        <view class="ct-book-info-container">
          <text class="ct-book-status ct-book-info">
            <text class="ct-book-status-str">{{ statusText }}</text>{{ lastChapterTitle }}
          </text>
          <touchable-opacity class="ct-reverse ct-book-info" :on-press="() => onReverse()" >
            <image class="ct-reverse-img" :source="require('../icons/Reverse.png')"></image>
            <text class="ct-reverse-text">倒序</text>
          </touchable-opacity>
        </view>
        <flat-list class="ct-main" :data="ctChapters"
          :render-item="(item) => renderChapter(item)"
          :style="{initialNumToRender: currentContentTableIndex}" />
      </view>
      <text class="ct-occupier" :on-press="() => onHideContentTable()"></text>
    </view>
  </view>
</template>
<script>
const EvHidden = 'hidden'
const EvGoBack = 'goback'
const EvPrevChapter = 'prevchapter'
const EvNextChapter = 'nextchapter'
const EvDownloadBook = 'downloadbook'
const EvReadModeSwitch = 'readmodeswitch'
const EvSwitchChapter = 'switchchapter'
const EvLike = 'like'

const ModeDay = 'day'
const ModeNight = 'night'
const ModeDayStr = '白天'
const ModeNightStr = '夜间'

import { ContentTableChapter } from '../book/book-functions'
import React from 'react'
import { Text, BackHandler } from 'react-native'
import ScreenBrightness from 'react-native-screen-brightness'
import OCRSlider from '../utils/OCRSlider'

var brightness = null
var ReadMode = ModeNight

export default {
  props: ['bookName', 'currentChapterTitle', 'prevChapterTitle',
          'nextChapterTitle', 'currentChapterIndex', 'chapters',
          'status', 'alreadyFinished', 'likeBook'],
  data () {
    return {
      switchToMode: ReadMode,
      readModeIconUri: require('../icons/MenuNightMode.png'),
      readModeStr: ModeNightStr,
      contentTableDisplaying: false,
      rootWidth: 0,
      rootHeight: 0,
      ctChapters: [],
      currentContentTableIndex: 0,
      brightness: 0,
      brightnessPercent: brightness,
      brightnessAdjusting: false,
      maxBrightness: 255,
      showMenuSetting: false
    }
  },
  components: {
    OCRSlider
  },
  mounted () {
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
  },
  beforeDestroy () {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
  },
  created () {
    this.createChapters()
    if (brightness === null) {
      ScreenBrightness.getBrightness().then((v) => {
          this.brightness = v
          this.brightnessPercent = this.brightness / this.maxBrightness
          ScreenBrightness.setAppBrightness(this.brightnessPercent)
          .then((v) => {
            brightness = v
          })
          .catch((e) => {
            console.log(e, this.brightnessPercent)
          })
        })
    }
    ScreenBrightness.requestPermission()
  },
  methods: {
    onHide: function () {
      this.$emit(EvHidden)
    },
    onNaviBack: function () {
      this.$emit(EvGoBack)
    },
    onDownloadBook: function () {
      this.$emit(EvDownloadBook)
    },
    onLikeBook: function () {
      this.$emit(EvLike, !this.likeBook)
    },
    onPrevChapter: function () {
      this.$emit(EvPrevChapter)
    },
    onNextChapter: function () {
      this.$emit(EvNextChapter)
    },
    onBookContentTable: function () {
      this.contentTableDisplaying = true
    },
    onHideContentTable: function () {
      this.contentTableDisplaying = false
    },
    onBrightness: function () {
      this.brightnessAdjusting = !this.brightnessAdjusting
    },
    onReverse: function () {
      this.ctChapters.reverse()
    },
    onReadModeSwitch: function () {
      this.brightnessAdjusting = false
      this.$emit(EvReadModeSwitch, this.switchToMode === ModeNight)
      if (ModeDay === this.switchToMode) {
        this.readModeIconUri = require('../icons/MenuNightMode.png')
        this.readModeStr = ModeNightStr
        this.switchToMode = ModeNight
      } else {
        this.readModeIconUri = require('../icons/MenuDayMode.png')
        this.readModeStr = ModeDayStr
        this.switchToMode = ModeDay
      }
      ReadMode = this.switchToMode
    },
    onSetting: function () {
      this.showMenuSetting = !this.showMenuSetting
      if (this.showMenuSetting) {
        setTimeout(() => {
          this.showMenuSetting = false
        }, 1000)
      }
    },
    onRootLayout: function (e) {
      this.rootHeight = e.nativeEvent.layout.height
      this.rootWidth = e.nativeEvent.layout.width
    },
    createChapters: function () {
      var chapters = []
      for (var i in this.chapters) {
        chapters.push(this.chapters[i])
      }
      this.ctChapters = chapters
    },
    renderChapter: function (item) {
      var content = null;
      var chapter = item.item
      var paddingLeft = 0
      var fontSize = 14
      var fontWeight = 'normal'
      var lineHeight = 30
      var color = '#2a2a2a'

      if (this.currentChapterIndex == chapter.index()) {
        color = 'red'
      }

      
      content = '  ' + chapter.title()
      paddingLeft = 0
        
      return (<Text
                style={{ lineHeight: lineHeight, paddingLeft: paddingLeft,
                         fontSize: fontSize, fontWeight: fontWeight, color: color }}
                         onPress={(e) => { this.onChapterSelected(chapter) }}>
                { content }
              </Text>)
    },
    onChapterSelected: function (chapter) {
      this.$emit(EvSwitchChapter, {chapter: chapter.index()})
    },
    onHardwareBackPress: function () {
      if (this.contentTableDisplaying) {
        this.contentTableDisplaying = false
        return true
      }
      this.onHide()
      return true
    },
    onBrightnessChanged: function (percent) {
      this.brightness = this.maxBrightness * percent
      ScreenBrightness.setAppBrightness(percent)
      .then((v) => {
        brightness = v
      })
      .catch ((e) => {
        console.log(e, this.brightness, percent)
      })
    } 
  },
  computed: {
    lastChapterTitle: function () {
      var chapters = this.chapters.length
      return this.chapters[chapters - 1].title();
    },
    statusText: function () {
      return this.alreadyFinished ? '已完结~~' : '连载中...'
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
}
.menu-body {
  background-color: #2a2a2a;
}
.menu-occupier {
  flex: 1;
}
.menu-slider {
  height: 50;
}
.top-menu {
  height: 50;
  flex-direction: row;
  align-items: center;
}
.bottom-menu {
  height: 150;
}
.top-menu-text {
  line-height: 50;
  text-align: right;
  font-size: 16;
  color: white;
  padding-right: 10;
  max-width: 200;
  padding-top: 15;
  padding-bottom: 15;
}
.top-menu-text-btn-container {
  height: 50;
}
.top-menu-text-btn {
  flex: 1;
  padding-left: 5;
  padding-right: 5;
  line-height: 30;
  margin-top: 10;
  margin-bottom: 10;
  margin-left: 5;
  margin-right: 5;
  font-size: 12;
  border-radius: 20;
  border-width: 1px;
  text-align: center;
}
.top-menu-text-btn-orange {
  color: orange;
  border-color: orange;
}
.top-menu-text-btn-lightgray {
  color: #a5a5a5;
  border-color: #a5a5a5;
}
.top-menu-btn {
  width: 35;
  height: 35;
}
.top-navi-back-btn {
  flex: 1;
}
.bottom-menu-chapter-cruiser {
  flex: 15;
  flex-direction: row;
  border-bottom-color: #101010;
  border-bottom-width: 1px;
  padding-top: 10;
}
.bottom-menu-func-btn {
  flex: 10;
  flex-direction: row;
  justify-content: space-evenly;
}
.chapter-item-container {
  flex: 1;
}
.chapter-item {
  text-align: center;
}
.chapter-item-index {
  font-size: 18;
  color: #a5a5a5;
  line-height: 30;
}
.chapter-item-title {
  flex: 1;
  font-size: 12;
  flex: 2;
  color: #5a5a5a;
  margin: 5;
  justify-content: center;
}
.chapter-item-current {
  border-left-color: #101010;
  border-left-width: 1px;
  border-right-color: #101010;
  border-right-width: 1px;
}
.menu-func-container {
  flex: 1;
  align-items: center;
  margin: 5;
}
.menu-func-image {
  width: 25;
  height: 25;
  padding: 5;
}
.menu-func-text {
  color: #5a5a5a;
  font-size: 12;
}
.content-table-container {
  position: absolute;
  left: 0;
  background-color: rgba(00, 00, 00, 0.5);
  flex-direction: row;
}
.content-table {
  flex: 7;
  padding: 10;
  background-color: #c2b194;
}
.ct-occupier {
  flex: 3;
}
.ct-bookname {
  height: 50;
  line-height: 50;
  font-size: 24;
  font-weight: bold;
  color: #2a2a2a;
}
.ct-book-info-container {
  flex-direction: row;
}
.ct-book-info {
  height: 20;
  font-size: 10;
  line-height: 20;
}
.ct-book-status {
  flex: 1;
  margin-left: 5;
  margin-right: 5;
}
.ct-book-status-str {
  height: 20;
  font-size: 8;
  line-height: 20;
  color: #5a5a5a;
}
.ct-reverse {
  flex-direction: row;
  align-items: flex-end;
}
.ct-reverse-img {
  width: 20;
  height: 20;
}
.ct-reverse-text {
  font-weight: bold;
  color: black;
  height: 20;
  font-size: 8;
  line-height: 20;
}
.ct-main {
  flex: 1;
  margin-top: 20;
  margin-bottom: 20;
  margin-right: 20;
  margin-left: 10;
}
.menu-setting-hint {
  background-color: rgba(00, 00, 00, 0.8);
  border-radius: 5;
  line-height: 100;
  text-align: center;
  color: white;
  margin: 20;
}
</style>
