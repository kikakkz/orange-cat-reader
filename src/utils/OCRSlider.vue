<template>
  <view class="container">
    <view class="bar-touch-area"
      :on-start-should-set-responder="() => {return true}"
      :on-responder-grant="(e) => onStart(e)"
      :on-responder-move="(e) => onMove(e)"
      :on-responder-release="(e) => onRelease(e)"
      :on-layout="(e) => onLayout(e)">
      <view class="bar-container bar-corner">
        <view class="bar-filler bar-corner" :style="{width: width}"></view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: ['initialValue'],
  data () {
    return {
      width: 20,
      viewWidth: 0
    }
  },
  methods: {
    onStart: function (e) {
      
    },
    onMove: function (e) {
      this.width = e.nativeEvent.locationX
      if (this.viewWidth - 2 <= this.width) {
        this.width = this.viewWidth - 2
      }
      this.$emit('valuechanged', this.width / this.viewWidth)
    },
    onRelease: function (e) {
      
    },
    onLayout: function (e) {
      this.viewWidth = e.nativeEvent.layout.width
      this.width = this.viewWidth * this.initialValue
    }
  }
}
</script>
<style scoped>
.container {
  height: 30;
  flex-direction: row;
  margin-left: 80;
  margin-right: 80;
  align-items: center;
}
.bar-corner {
  border-radius: 4;
}
.bar-touch-area {
  flex: 1;
  height: 30;
  padding-top: 10;
  padding-bottom: 10;
}
.bar-container {
  flex: 1;
  background-color: #2a2a2a;
  border-color: #2a2a2a;
  border-width: 1px;
  height: 10;
}
.bar-filler {
  background-color: orange;
  height: 8;
}
.bar-btn {
  width: 6;
  height: 6;
  margin: 12;
}
.bar-btn-container {
  width: 30;
  height: 30;
}
</style>
