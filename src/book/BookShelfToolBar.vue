<template>
  <view class="container" :style="{width: screenWidth}">
    <view class="toolbar toolbar-left">
      <touchable-opacity class="image-btn" :on-press="() => onSelectAllClick()">
        <image class="image-btn" :source="allSelectIcon"></image>
      </touchable-opacity>
    </view>
    <view class="toolbar toolbar-right">
      <touchable-opacity class="image-btn" :on-press="() => onDelete()">
        <image class="image-btn" :source="require('../icons/Delete.png')"></image>
      </touchable-opacity>
      <touchable-opacity class="image-btn" :on-press="() => onClose()">
        <image class="image-btn" :source="require('../icons/Close.png')"></image>
      </touchable-opacity>
    </view>
  </view>
</template>
<script>
import { EvAllSelected, EvDelete, EvClose } from './book-event'
import { screenWidth } from '../utils/screen-utils'

export default {
  data () {
    return {
      allSelected: false,
      screenWidth: screenWidth
    }
  },
  methods: {
    onSelectAllClick: function () {
      this.allSelected = !this.allSelected
      this.$emit(EvAllSelected, this.allSelected)
    },
    onDelete: function () {
      this.$emit(EvDelete)
    },
    onClose: function () {
      this.$emit(EvClose)
    }
  },
  computed: {
    allSelectIcon: function () {
      return this.allSelected ? require('../icons/Checked.png') : require('../icons/Unchecked.png')
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
  flex-direction: row;
  background-color: #2a2a2a;
  height: 50;
  padding-left: 20;
  padding-right: 20;
}
.toolbar {
  flex-direction: row;
  align-items: center;
}
.toolbar-left {
  flex: 7;
  justify-content: flex-start;
}
.toolbar-right {
  flex: 3;
  justify-content: flex-end;
}
.image-btn {
  width: 25;
  height: 25;
  margin-left: 5;
  margin-right: 5;
}
</style>
