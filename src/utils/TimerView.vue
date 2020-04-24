<template>
  <view class="timer-view">
    <text class="timer-text" :on-press="() => onStop()">
      {{ textStr }}{{ (durationMs - elapseMs) / 1000 }}s
    </text>
  </view>
</template>
<script>
const EvIntervalTick  = 'interval_tick'
const EvTimeout     = 'timeout'
const EvStopped     = 'stopped'
export default {
  props: {
    id: String,
    text: String,
    duration: Number,
    interval: Number,
    stoppable: Boolean
  },
  data() {
    return {
      elapseMs: 0,
      idStr: this.id,
      textStr: this.text,
      durationMs: this.duration,
      intervalMs: this.interval,
      timer: null
    }
  },
  methods: {
    timeout() {
      this.elapseMs += this.intervalMs
      if (this.elapseMs < this.duration) {
        this.timer = setTimeout(this.timeout, this.intervalMs)
        this.$emit(EvIntervalTick, this.id)
        return
      }
      this.$emit(EvTimeout, this.id)
    },
    onStop() {
      this.$emit(EvStopped, this.id)
      clearTimeout(this.timer)
    }
  },
  created() {
    this.timer = setTimeout(this.timeout, this.intervalMs)
  },
  componentWillUnmount () {
    clearTimeout(this.timer)
  }
}
</script>
<style scoped>
.timer-view {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 16;
}
.timer-text {
  font-size: 12;
  margin: 5;
  text-align: center;
}
</style>