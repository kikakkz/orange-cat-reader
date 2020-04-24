<template>
  <view class="container">
    <touchable-opacity class="avatar" :on-press="() => onUserSet()">
      <image class="avatar" :source="genderIcon"
        :style="{resizeMode: 'contain'}"></image>
    </touchable-opacity>
    <view class="user-info">
      <text class="user-info-text">{{ id }}</text>
      <touchable-opacity :on-press="() => onCopyId()">
        <image class="id-copy-btn" :source="require('../icons/Copy.png')"></image>
      </touchable-opacity>
    </view>
  </view>
</template>
<script>
import React from 'react'
import { Clipboard } from 'react-native'

GenderBoy = '男生'
GenderGirl = '女生'
GenderUnknow = '未确定'

export default {
  props: ['id', 'gender'],
  methods: {
    onCopyId: function () {
      Clipboard.setString(this.id)
      this.$emit('idcopied')
    },
    onUserSet: function () {
      this.$emit('setavatar')
    }
  },
  computed: {
    genderIcon: function () {
      if (this.gender === GenderBoy) {
        return require('../icons/Boy.png')
      }
      if (this.gender === GenderGirl) {
        return require('../icons/Girl.png')
      }
      if (this.gender === GenderUnknow) {
        return require('../icons/FireYellow.png')
      }
    }
  }
}
</script>
<style scoped>
.container {
  flex-direction: row;
  margin-top: 20;
}
.avatar {
  width: 50;
  height: 50;
}
.user-info {
  flex: 1;
}
.user-info-text {
  font-weight: bold;
  color: black;
  line-height: 25;
}
.id-copy-btn {
  width: 20;
  height: 20;
  margin: 5;
}
</style>
