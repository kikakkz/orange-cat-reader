<template>
  <view class="container">
    <touchable-opacity :on-press="() => onBack()">
      <image class="back-btn" :source="require('../icons/TitleBarNaviBack.png')"></image>
    </touchable-opacity>
    <text class="title">{{ title }}</text>
    <text class="cancel" :on-press="() => onCancel()">{{ cancelText }}</text>
  </view>
</template>
<script>

const EvBack = 'back'
const EvCancel = 'cancel'

export default {
  props: ['title', 'cancelText'],
  methods: {
    onBack: function () {
      this.$emit('back')
    },
    onCancel: function () {
      this.$emit('cancel')
    }
  }
}
</script>
<style scoped>
.container {
  height: 40;
  flex-direction: row;
  background-color: #2a2a2a;
}
.back-btn {
  width: 30;
  height: 30;
  margin: 5;
}
.title {
  flex: 1;
  line-height: 40;
  color: white;
  font-size: 20;
  text-align: center;
}
.cancel {
  color: white;
  line-height: 30;
  font-size: 12;
  margin: 5;
  width: 30;
}
</style>
