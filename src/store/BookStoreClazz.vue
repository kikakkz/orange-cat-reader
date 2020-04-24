<template>
  <view class="container">
    <scroll-view>
      <HotBulletin
        v-for="clazz in clazzs"
        :key="clazz"
        :navigation="navigation"
        :title="clazz"></HotBulletin>
    </scroll-view>
    <view class="page-loading" :style="{height: screenHeight, width: screenWidth}">
      <activity-indicator v-if="loading" size="large" color="orange"></activity-indicator>
    </view>
  </view>
</template>
<script>
import HotBulletin from '../bulletin/HotBulletin'
const { api } = require('../api/api.js')
import { screenHeight, screenWidth } from '../utils/screen-utils'

export default {
  props: ['navigation'],
  data () {
    return {
      clazzs: [],
      loading: true,
      screenHeight: screenHeight,
      screenWidth: screenWidth
    }
  },
  created () {
    this.loading = true
    api.booksInfo()
    .then((res) => {
      this.loading = false
      var data = api.parseApiResponse(res)
      if (null === data) {
        console.error(res)
        return
      }
      if (0 != data.code) {
        console.error(data.error)
        return
      }
      this.clazzs = data.body.clazzs
    })
    .catch((e) => {
      console.error(e)
    })
  },
  components: {
    HotBulletin
  }
}
</script>
<style scoped>
.page-loading {
  position: absolute;
  justify-content: center;
}
</style>
