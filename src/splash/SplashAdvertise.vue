<template>
  <view class="splash-advertise">
    <image
      :style="{flex: 1, width: undefined, height: undefined, resizeMode: 'stretch'}"
      :source="require('../images/PresetAdvertise.png')"/>
  </view>
</template>
<script>
export default {
}
</script>
<style scoped>
.splash-advertise {
  border-bottom-width: 1px;
  border-bottom-color: lightgray;
}
</style>