<template>
  <view>
    <SplashAdvertise class="advertise"></SplashAdvertise>
    <SplashBanner class="banner"></SplashBanner>
    <Copyright class="copyright"></Copyright>
  </view>
</template>
<script>
import SplashAdvertise from './SplashAdvertise'
import SplashBanner from './SplashBanner'
import Copyright from '../utils/Copyright'
import { bookShelf } from '../book/book-functions'
export default {
  components: {
    SplashAdvertise,
    SplashBanner,
    Copyright
  },
  created () {
    bookShelf.load()
  }
}
</script>
<style scoped>
.advertise {
  flex: 16;
}
.banner {
  flex: 3;
}
.copyright {
  flex: 1;
}
</style>
