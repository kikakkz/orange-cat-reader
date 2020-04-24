<template>
  <view class="dialog-bg" :on-layout="(e) => onRootLayout(e)">
    <touchable-opacity class="occupier" :on-press="() => onCancel()">
      <view class="occupier-view"></view>
    </touchable-opacity>
    <view class="dialog"  :stype="{width: rootWidth}">
      <view class="hint-text-container">
        <text class="hint-text">{{ hint }}</text>
      </view>
      <view class="func-btn-area">
        <touchable-opacity class="func-btn-container" :on-press="() => onCancel()">
          <text class="func-btn-text func-btn-left">{{ leftText }}</text>
        </touchable-opacity>
        <touchable-opacity v-if="showMiddle" class="func-btn-container" :on-press="() => onOther()">
          <text class="func-btn-text func-btn-right">{{ middleText }}</text>
        </touchable-opacity>
        <touchable-opacity class="func-btn-container" :on-press="() => onConfirm()">
          <text class="func-btn-text func-btn-right">{{ rightText }}</text>
        </touchable-opacity>
      </view>
    </view>
    <touchable-opacity class="occupier" :on-press="() => onDoNothing()">
      <view class="occupier-view"></view>
    </touchable-opacity>
  </view>
</template>
<script>
import { BackHandler } from 'react-native'

const EvCancel = 'cancel'
const EvConfirm = 'confirm'
const EvDoNothing = 'nothing'

export default {
  props: {
    hint: {
      type: String,
      default: ''
    },
    leftText: {
      type: String,
      default: '取消'
    },
    middleText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: '确定'
    },
    showMiddle: {
      type: Boolean,
      default: false
    },
    respondBack: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rootWidth: 0
    }
  },
  mounted () {
    if (this.respondBack) {
      BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
    }
  },
  methods: {
    onCancel: function () {
      BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
      this.$emit('cancel')
    },
    onConfirm: function () {
      BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
      this.$emit('confirm')
    },
    onDoNothing: function () {
      BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
      this.$emit('nothing')
    },
    onRootLayout: function (e) {
      this.rootWidth = e.nativeEvent.layout.width
    },
    onOther: function () {
      BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
      this.$emit('other')
    },
    enter: function () {
      BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
    },
    onHardwareBackPress: function () {
      this.onDoNothing()
      return true
    }
  }
}
</script>
<style scoped>
.dialog-bg {
  background-color: rgba(00, 00, 00, 0.5);
}
.occupier {
  flex: 35;
}
.occupier-view {
  flex: 1;
}
.dialog {
  background-color: #f5f5f5;
  margin: 20;
  border-radius: 4;
  flex: 30;
  margin: 20;
}
.hint-text-container {
  flex: 1;
  align-items: center;
  border-bottom-color: white;
  border-bottom-width: 1px;
  justify-content: space-evenly;
}
.hint-text {
  margin: 20;
  text-align: center;
  justify-content: center;
}
.func-btn-container {
  flex: 1;
}
.func-btn-area {
  height: 40;
  flex-direction: row;
  justify-content: space-evenly;
}
.func-btn-left {
  border-right-color: white;
  border-right-width: 1px;
}
.func-btn-right {
  border-left-color: white;
  border-left-width: 1px;
}
.func-btn-text {
  flex: 1;
  text-align: center;
  align-self: stretch;
  line-height: 40;
  font-size: 16;
  color: #5a5a5a;
  font-weight: bold;
}
</style>
