<template>
    <div class="splash-screen">
        <SplashAdv class="advertise"></SplashAdv>
        <SplashBanner class="banner"></SplashBanner>
        <Copyright class="copyright"></Copyright>
        <TimerView class="timer"
            :id="id" text="跳过" :duration=3000
            :interval=1000 @timeout="onTimeout"
            :stoppable=true @stopped="onStopped">
        </TimerView>
    </div>
</template>
<script>
import TimerView from '../utils/TimerView'
import SplashAdv from './SplashAdv'
import SplashBanner from './SplashBanner'
import Copyright from '../utils/Copyright'
module.exports = {
    components: {
        TimerView,
        SplashAdv,
        SplashBanner,
        Copyright
    },
    data() {
        return {
            id: 'splash_screen'
        }
    },
    methods: {
        onTimeout(id) {
            this.$router.push({path: '/main'})
        },
        onStopped(id) {
            this.$router.push({path: '/main'})
        }
    }
}
</script>
<style scoped>
.splash-screen {
    width: 100%;
    height: 100%;
}
.timer {
    float: right;
    margin-right: 20px;
    margin-top: 20px;
}
.advertise {
    position: absolute;
    top: 0;
    height: 80%;
    width: 100%;
    z-index: -1;
}
.banner {
    position: absolute;
    top: 80%;
    width: 100%;
}
.copyright {
    position: absolute;
    bottom: 0px;
    width: 100%;
}
</style>