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
      text: '    橘猫是基于兴趣的免费阅读社区。起源于一只其懒无比的猫，猫有一个中二的主人，因此也导致橘猫略显中二的风格。' + 
            '橘猫最初作为网络阅读聚合平台推出，整合网络上众多的阅读资源，囊括仙侠、武侠、奇幻、玄幻、耽美、同人等不同类别。' +
            '橘猫同时推出素人专栏频道，聚集对某特色领域有特定研究的人群，分享他们生活中的点点滴滴，展现最贴近生活的阅读方式。',
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
