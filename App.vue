<template>
  <view class="container">
    <SplashScreen class="container" v-if="!bootCompleted"></SplashScreen>
    <Navigator ref="Navigator" class="container" v-if="bootCompleted"></Navigator>
    <TimerView class="timer" v-if="!bootCompleted"
      :id="id" text="跳过" :duration=3000
      :interval=1000 @timeout="onTimeout"
      :stoppable=true @stopped="onStopped">
    </TimerView>
  </view>
</template>
<script>
import Vue from 'vue-native-core'
import { VueNativeBase } from 'native-base'
Vue.use(VueNativeBase)

import SplashScreen from './src/splash/SplashScreen'
import Navigator from './src/navi/Navigator'
import TimerView from './src/utils/TimerView'
export default {
  data () {
    return {
      bootCompleted: false,
      bootTimer: 0,
      id: 'BootTimer'
    }
  },
  components: {
    SplashScreen,
    Navigator,
    TimerView
  },
  methods: {
    onBootCompleted(id) {
      if (id != this.id) {
        return
      }
      this.bootCompleted = true
    },
    onTimeout (id) {
      this.onBootCompleted(id)
    },
    onStopped (id) {
      this.onBootCompleted(id)
    }
  }
}
</script>
<style>
.timer {
  position: absolute;
  top: 20;
  right: 20;
}
.container {
  flex: 1;
}
</style>
