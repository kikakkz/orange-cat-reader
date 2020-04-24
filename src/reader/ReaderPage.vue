<template>
  <view class="content-page"
    :on-start-should-set-responder="() => {return true}"
    :on-responder-grant="(e) => onMoveStart(e)"
    :on-responder-move="(e) => onMove(e)"
    :on-responder-release="(e) => onMoveRelease(e)"
    :on-layout="(e) => onRootLayout(e)">
    <view class="content-docker" v-if="cover"
      :style="{width: rootWidth, height: rootHeight,
      left: areaLeft, backgroundColor: backgroundColor}">
      <image class="content-bg" :source="require('../icons/CoverDefault.png')"></image>
      <text class="content-bookname">{{ bookName }}</text>
      <text class="content-author">{{ author }}</text>
      <view class="content-abbreviation-container">
        <text class="content-abbreviation-left"></text>
        <text class="content-abbreviation">{{ abbreviation }}</text>
      </view>
      <view class="cover-occupier"
        :style="{width: rootWidth, height: rootHeight}"></view>
    </view>
    <view class="content-docker" v-else
      :style="{width: rootWidth, height: rootHeight,
      left: areaLeft, backgroundColor: backgroundColor}">
      <view class="content-header-footer" v-if="!showTitle">
        <text class="header-footer-text header-text">{{ title }}</text>
      </view>
      <view v-if="showTitle" :style="{height: titleHeight}">
        <text class="title" :style="{height: titleHeight, lineHeight: titleHeight}">{{ title }}</text>
      </view>
      <view class="content-container">
        <text class="content" :style="{fontSize: fontSize, lineHeight: lineHeight, color: fontColor}">
          {{ page.content }}
        </text>
      </view>
      <view class="content-header-footer">
        <text class="header-footer-text footer-left-text">
          {{ Math.round(page.pageIndex * 100 / chapterPages * 100) / 100 }}%
        </text>
        <text class="header-footer-text footer-right-text">
          {{ "第" + page.pageIndex + "页" }}
        </text>
      </view>
    </view>
    <view class="debug-view">
      <text class="debug-view">{{ layer }}</text>
    </view>
  </view>
</template>
<script>

import {
  touchArea,
  AREA_TOP_LEFT,
  AREA_CENTER_LEFT,
  AREA_BOTTOM_LEFT,
  AREA_TOP_RIGHT,
  AREA_CENTER_RIGHT,
  AREA_BOTTOM_RIGHT,
  AREA_CENTER_CENTER } from '../utils/screen-utils'

EvShowMenu = 'showmenu'
EvNextPage = 'nextpage'
EvPrevPage = 'prevpage'

const DirLeft = 'left'
const DirRight = 'right'

import React from 'react'
import { Easing } from 'react-native'

export default {
  props: ['page', 'title', 'chapterPages', 'fontSize', 'lineHeight', 'titleHeight', 'nightMode', 'layer'],
  data () {
    return {
      headerHeight: 0,
      rootWidth: 0,
      rootHeight: 0,
      backgroundDayColor: rgb(0xc2, 0xb1, 0x94),
      backgroundNightColor: rgb(66, 70, 59),
      fontDayColor: rgb(40, 40, 40),
      fontNightColor: rgb(128, 128, 128),
      nightModeEnable: this.nightMode,
      moved: false,
      moveStartX: 0,
      translateX: 0,
      areaLeft: 0,
      direction: DirRight,
      enableAnimation: false
    }
  },
  methods: {
    onPagePressed: function (e) {
      var area = touchArea(
        e.nativeEvent.locationX, e.nativeEvent.locationY,
        this.rootWidth, this.rootHeight)
      switch (area) {
      case AREA_TOP_LEFT:
      case AREA_CENTER_LEFT:
      case AREA_BOTTOM_LEFT:
        this.direction = DirRight
        if (this.cover) {
          return
        }
        break
      case AREA_TOP_RIGHT:
      case AREA_CENTER_RIGHT:
      case AREA_BOTTOM_RIGHT:
        this.direction = DirLeft
        break
      case AREA_CENTER_CENTER:
        this.$emit(EvShowMenu)
        return
      }
      if (!this.enableAnimation) {
        this.switchPage()
        return
      }
      this.movePage(10, 0)
    },
    onMoveStart: function (e) {
      this.moveStartX = e.nativeEvent.pageX
    },
    onMove: function (e) {
      this.moved = true
      var x = e.nativeEvent.pageX

      if (this.cover && this.moveStartX < x) {
        return
      }

      this.$nextTick(() => { this.areaLeft = x - this.moveStartX })
    },
    switchPage: function () {
      if (DirRight === this.direction) {
        this.$emit(EvPrevPage)
      } else {
        this.$emit(EvNextPage)
      }
    },
    movePageTo: function (x, endX, step, timeout) {
      this.areaLeft = x
      if (Math.abs(x - endX) < 5) {
        this.areaLeft = endX
        this.switchPage()
        return
      }
      var targetX = x + step
      setTimeout(() => { this.movePageTo(targetX, endX, step, timeout) }, timeout)
    },
    movePage: function (steps, delay) {
      var endX = 0
      if (DirRight === this.direction) {
        endX = this.rootWidth
      } else {
        endX = 0 - this.rootWidth
      }
      setTimeout(() => { this.movePageTo(this.areaLeft, endX, (endX - this.areaLeft) / steps, 20) }, delay)
    },
    onMoveRelease: function (e) {
      if (!this.moved) {
        this.onPagePressed(e)
        return
      }
      this.moved = false
      if (e.nativeEvent.pageX < this.moveStartX) {
        this.direction = DirLeft
      } else {
        this.direction = DirRight
        if (this.cover) {
          return
        }
      }
      if (!this.enableAnimation) {
        this.switchPage()
        return
      }
      this.movePage(5, 20)
    },
    onRootLayout: function (e) {
      this.rootHeight = e.nativeEvent.layout.height
      this.rootWidth = e.nativeEvent.layout.width
    }
  },
  computed: {
    showTitle: function () {
      if (undefined === this.page || null === this.page) {
        return false
      }
      return 1 === this.page.pageIndex
    },
    cover: function () {
      if (!this.page) {
        return false
      }
      if (!this.page.cover) {
        return false
      }
      return this.page.cover
    },
    bookName: function () {
      if (undefined === this.page || null === this.page) {
        return ''
      }
      if (!this.cover) {
        return ''
      }
      return this.page.bookName
    },
    abbreviation: function () {
      if (undefined === this.page || null === this.page) {
        return ''
      }
      if (!this.cover) {
        return ''
      }
      return this.page.abbreviation
    },
    author: function () {
      if (undefined === this.page || null === this.page) {
        return ''
      }
      if (!this.cover) {
        return ''
      }
      return this.page.author
    },
    backgroundColor: function () {
      return this.nightMode ? this.backgroundNightColor : this.backgroundDayColor
    },
    fontColor: function () {
      return this.nightMode ? this.fontNightColor : this.fontDayColor
    }
  },
  watch: {
    page: function () {
      this.areaLeft = 0
    }
  }
}
</script>
<style scoped>
.content-container {
  flex: 1;
}
.content-page {
  position: absolute;
}
.content-docker {
  flex: 1;
}
.content-header-footer {
  flex-direction: row;
  padding: 10;
}
.header-footer-text {
  font-size: 9;
  flex: 1;
}
.header-text {
  text-align: left;
}
.footer-left-text {
  text-align: left;
}
.footer-right-text {
  text-align: right;
}
.content {
  flex: 1;
  font-family:'Times New Roman', Times, serif;
  padding-left: 10;
  padding-right: 10;
}
.title {
  font-size: 26;
  font-weight: bold;
  text-align: center;
}
.content-bg {
  position: absolute;
}
.content-bookname {
  line-height: 150;
  margin: 60;
  text-align: center;
  font-size: 28;
  font-weight: bold;
  color: black;
}
.content-author {
  line-height: 50;
  font-size: 18;
  text-align: center;
  color: blue;
}
.content-abbreviation-container {
  flex: 1;
  flex-direction: row;
}
.content-abbreviation-left {
  flex: 1;
}
.content-abbreviation {
  flex: 1;
  font-size: 10;
  margin: 10;
}
.cover-occupier {
  position: absolute;
  background-color: transparent;
}
.debug-view {
  position: absolute;
  font-size: 60;
  font-weight: bold;
  height: 0;
  width: 0;
  color: #ff000080;
}
</style>
