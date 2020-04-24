<template>
  <view class="container">
    <ImageCard class="cover" :width=50 :height=70
      :uri="coverUri" :local="localCover" :flex=0 />
    <view class="text-container">
      <text class="text">{{ text }}</text>
      <text class="user" >推荐人：{{ user }}</text>
    </view>
  </view>
</template>
<script>
import ImageCard from './ImageCard'
export default {
  props: ['coverUri', 'text', 'user', 'localCover'],
  components: {
    ImageCard
  }
}
</script>
<style scoped>
.container {
  background-color: white;
  flex-direction: row;
  padding-top: 10;
  margin-left: 25;
  margin-right: 5;
}
.cover {
  left: -20;
  padding-top: 5;
}
.text-container {
  flex: 1;
  height: 100;
}
.text {
  flex: 1;
  margin-left: 0;
  margin-right: 10;
  margin-bottom: 20;
  line-height: 16;
  font-size: 12;
  font-family: Arial, Helvetica, sans-serif
}
.user {
  text-align: right;
  margin-right: 10;
  font-size: 10;
  color: blue;
}
</style>
