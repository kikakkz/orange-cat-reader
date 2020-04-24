<template>
  <view class="book-shelf-header">
    <view class="weekly-read-info">
      <text class="read-info-base read-info">本周已读 </text>
      <text class="read-info-base weekly-mins">{{ weeklyReadMins }}</text>
      <text class="read-info-base read-info"> 分钟</text>
    </view>
    <view class="header-menu-btns">
      <touchable-opacity class="header-menu-btn-container" :on-press="() => onSearch()">
        <image
          class="header-menu-btn"
          :style="{resizeMode: 'contain'}"
          :source="require('../icons/Search.png')" />
      </touchable-opacity>
      <touchable-opacity class="header-menu-btn-container" :on-press="() => onAdd()">
        <image
          class="header-menu-btn"
          :style="{resizeMode: 'contain'}"
          :source="require('../icons/Add.png')" />
        </touchable-opacity>
    </view>
  </view>
</template>
<script>
const { readerInfo } = require('../reader/reader-utils.js')

export default {
  props: ['navigation'],
  data() {
    return {
      weeklyReadMins: 7
    }
  },
  methods: {
    onSearch: function () {
      this.navigation.navigate('SearchBookList', {searchText: ''})
    },
    onAdd: function () {
      this.$emit('addbook')
    },
    enter: function () {
      readerInfo.load()
      .then ((v) => {
        this.weeklyReadMins = readerInfo.getWeeklyReadMins()
      })
      .catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>
<style scoped>
.book-shelf-header {
  height: 50;
  flex-direction: row;
}
.weekly-read-info {
  flex: 1;
  flex-direction: row;
  height: 50;
  align-items: flex-end;
  padding-bottom: 12;
  padding-left: 12;
}
.read-info {
  font-size: 10;
  color: #5a5a5a;
}
.read-info-base {
  font-family: Arial, Helvetica, sans-serif;
}
.weekly-mins {
  font-size: 18;
  color: #2a2a2a;
  font-weight: bold;
  margin: 0;
}
.header-menu-btns {
  flex-direction: row;
  align-self: flex-end;
  padding-right: 12;
}
.header-menu-btn-container {
  width: 50;
  height: 50;
  padding: 15;
  align-items: center;
}
.header-menu-btn {
  flex: 1;
}
</style>