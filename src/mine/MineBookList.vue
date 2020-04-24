<template>
  <view class="container">
    <CommonHeader :title="title" @back="onBack" @cancel="onCancel"
      :cancelText="cancelText"></CommonHeader>
    <scroll-view v-if="0 < books.length" class="book-container">
      <template v-for="(book, index) in books">
        <touchable-opacity :on-long-press="() => onLongPress()" :key="index"
          :on-layout="(e) => onItemLayout(e)" >
          <ScoreBulletinBook :navigation="navigation" class="good-book-recommend"
            :height="itemHeight" :book="book" @booklongpress="onLongPress"></ScoreBulletinBook>
          <touchable-opacity class="book-delete-container"
            v-if="deletingMode" :on-press="() => onDelete(book)"
            :style="{height: itemLayoutHeight, width: itemWidth}">
            <image class="book-delete-btn" v-if="deletingMode"
              :source="require('../icons/Unselected.png')"
              :style="{resizeMode: 'contain'}"></image>
          </touchable-opacity>
        </touchable-opacity>
      </template>
    </scroll-view>
    <text v-if="0 == books.length" class="hint" :on-press="() => onHintPress()">
      没有感兴趣的书？点我发现精彩世界～～
    </text>
  </view>
</template>
<script>
import CommonHeader from '../utils/CommonHeader'
import ScoreBulletinBook from '../bulletin/ScoreBulletinBook'
import { BackHandler } from 'react-native'

export default {
  props: ['books', 'navigation', 'itemHeight', 'title'],
  components: {
    CommonHeader,
    ScoreBulletinBook
  },
  data () {
    return {
      deletingMode: false,
      itemWidth: 0,
      itemLayoutHeight: 0
    }
  },
  methods: {
    onBack: function () {
      this.deletingMode = false
      BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
      this.$emit('back')
    },
    enter: function () {
      BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
    },
    onCancel: function () {
      if (this.deletingMode) {
        this.deletingMode = false
        return
      }
      this.$emit('deleteall')
      this.onBack()
    },
    onDelete: function (book) {
      this.$emit('delete', book)
    },
    onHardwareBackPress: function () {
      this.onBack()
      return true
    },
    onHintPress: function () {
      this.$emit('gotorecommend')
      BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
    },
    onLongPress: function () {
      this.deletingMode = true
    },
    onItemLayout: function (e) {
      this.itemWidth = e.nativeEvent.layout.width
      this.itemLayoutHeight = e.nativeEvent.layout.height
    }
  },
  mounted () {
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
  },
  beforeDestroy () {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
  },
  computed: {
    cancelText: function () {
      return this.deletingMode ? '取消' : '清空'
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
  background-color: #f0f0f0;
}
.good-book-recommend {
  margin: 5;
}
.book-container {
  margin: 10;
}
.hint {
  align-self: stretch;
  line-height: 50;
  font-size: 14;
  justify-content: center;
  text-align: center;
  background-color: #a5a5a5;
  margin: 10;
}
.book-delete-container {
  position: absolute;
}
.book-delete-btn {
  position: absolute;
  height: 25;
  width: 25;
  right: 0;
  top: 0;
}
</style>
