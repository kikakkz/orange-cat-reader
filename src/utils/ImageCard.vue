<template>
  <view>
    <image
      :style="{flex: flex, resizeMode: 'stretch', width: width, height: height}"
      :source="imageUri" :on-error="(e) => onLoadError(e)" />
  </view>
</template>
<script>
export default {
  props: ['height', 'width', 'uri', 'flex', 'local'],
  data () {
    return {
      userLocalImage: this.local == true || this.local == "true"
    }
  },
  methods: {
    onLoadError: function (e) {
      this.imageUri = require('../images/PresetAdvertise.png')
    }
  },
  computed: {
    imageUri: function () {
      return this.userLocalImage ? this.uri : {uri: this.uri}
    }
  }
}
</script>
<style scoped>
</style>
