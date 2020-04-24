<template>
  <view :style="{height: height}" class="carousel-outer" :on-layout="(e) => onLayout(e)">
    <image class="carousel-bg" :source="bgImage"
        :style="{resizeMode: 'stretch', height: viewHeight, width: viewWidth}"></image>
    <touchable-opacity class="carousel-container"
      v-for="(uri, index) in currentUris"
      :key="index" :on-press="() => onItemPress(uri)">
      <image class="carousel-container carousel-image"
        :source="uri.uri" :style="{resizeMode: 'contain', width: viewWidth / 3 - 20}"></image>
    </touchable-opacity>
  </view>
</template>
<script>
import { ActGotoReader } from '../utils/carousel-utils'

export default {
  props: ['uris', 'height', 'navigation'],
  data () {
    return {
      currentIndex: 0,
      bgImage: require('../images/SkyNight.jpg'),
      viewWidth: 0,
      viewHeight: this.height,
      carouseling: false,
      currentUris: [
        {uri: require('../images/PresetAdvertise.png'), obj: null},
        {uri: require('../images/PresetAdvertise.png'), obj: null},
        {uri: require('../images/PresetAdvertise.png'), obj: null}
      ],
      interval: 2000,
      timer: null
    }
  },
  created () {
    if (this.readyToShow) {
      timer = setTimeout(this.carousel, this.interval)
      this.carouseling = true
    }
  },
  methods: {
    onItemPress: function (uri) {
      switch (uri.obj.action) {
      case ActGotoReader:
        this.navigation.navigate('Reader', {book: uri.obj.obj})
        break
      }
    },
    onLayout: function (e) {
      this.viewHeight = e.nativeEvent.layout.height
      this.viewWidth = e.nativeEvent.layout.width
    },
    carousel: function () {
      var uris = []

      for (var i = 0; i < this.currentUris.length; i++) {
        var uri = this.uris[(this.currentIndex + i) % this.uris.length]
        uris.push({uri: {uri: uri.uri}, obj: uri})
      }
      this.currentIndex += uris.length
      this.currentUris = uris
      timer = setTimeout(this.carousel, this.interval)
    }
  },
  computed: {
    readyToShow: function () {
      return (null != this.uris && undefined != this.uris && 0 != this.uris.length)
    }
  },
  watch: {
    uris: function () {
      if (this.readyToShow) {
        if (!this.carouseling) {
          timer = setTimeout(this.carousel, 0)
        }
        this.currentIndex = 0
        this.carouseling = true
      } else {
        if (this.carouseling) {
          clearTimeout(timer)
        }
      }
    }
  }
}
</script>
<style scoped>
.carousel-outer {
  flex-direction: row;
  justify-content: space-evenly;
}
.carousel-container {
  flex: 1;
  margin: 5;
}
.carousel-image {
  flex: 1;
  border-radius: 5;
}
.carousel-bg {
  position: absolute;
}
</style>
