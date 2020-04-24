<template>
    <div class="timer-view">
        <p @click="onStop">{{ textStr }}{{ (durationMs - elapseMs) / 1000 }}s</p>
    </div>
</template>
<script>
const EvIntervalTick    = 'interval_tick'
const EvTimeout         = 'timeout'
const EvStopped         = 'stopped'
module.exports = {
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
            console.log("STOPPPPPP")
            this.$emit(EvStopped, this.id)
            clearTimeout(this.timer)
        }
    },
    created() {
        this.timer = setTimeout(this.timeout, this.intervalMs)
    }
}
</script>
<style scoped>
.timer-view {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    width: 50px;
}
p {
    font-size: 12px;
    margin: 2px 3px 2px 3px;
    text-align: center;
}
</style>