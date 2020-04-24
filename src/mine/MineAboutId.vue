<template>
  <view class="container">
    <CommonHeader :title="title" @back="onBack" :cancelText="cancelText"></CommonHeader>
    <view class="about-body">
      <image class="about-banner"
        :style="{width: screenWidth, resizeMode: 'contain'}"
        :source="require('../images/banner.png')"></image>
      <text class="about-text">{{ text }}</text>
    </view>
  </view>
</template>
<script>
import CommonHeader from '../utils/CommonHeader'
import { BackHandler } from 'react-native'

import { screenWidth } from '../utils/screen-utils'

export default {
  props: ['title', 'cancelText'],
  data () {
    return {
      text: '    橘猫是完全匿名的阅读社区，因此不设置注册和登录机制。但橘猫会为每次应用安装生成唯一ID，该ID会对应一系列在橘猫' +
            '的阅读行为。橘猫ID用于提供将橘猫阅读行为在不同设备间进行转移的能力，对于需要转移阅读行为的用户，务请记录橘猫ID。',
      screenWidth: screenWidth
    }
  },
  methods: {
    onBack: function () {
      BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
      this.$emit('back')
    },
    enter: function () {
      BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
    },
    onHardwareBackPress: function () {
      this.onBack()
      return true
    }
  },
  components: {
    CommonHeader
  },
  mounted () {
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
  }
}
</script>
<style scoped>
.container {
  flex: 1;
}
.about-body {
  flex: 1;
  margin: 10;
}
.about-banner {
  height: 90;
}
.about-text {
  font-size: 12;
  line-height: 18;
}
</style>
