<template>
  <view class="container">
    <SearchBar @search="onSearch"></SearchBar>
    <scroll-view :on-momentum-scroll-end="(e) => onScrollEnd(e)">
      <Bulletin class="bulletin" :navigation="navigation"
        title="搜索最多" clazz="searches"></Bulletin>
      <Bulletin class="bulletin" :navigation="navigation"
        title="投票最多" clazz="votes"></Bulletin>
      <Bulletin class="bulletin" :navigation="navigation"
        title="阅读最多" clazz="reads"></Bulletin>
      <MoreBulletin ref="GenderMoreBulletin" class="bulletin" :navigation="navigation"
        title="总排行榜" :itemHeight=100 clazz="score"></MoreBulletin>
    </scroll-view>
  </view>
</template>
<script>
import Bulletin from '../bulletin/Bulletin'
import MoreBulletin from '../bulletin/MoreBulletin'
import SearchBar from '../utils/SearchBar'

export default {
  props: ['navigation'],
  components: {
    Bulletin,
    SearchBar,
    MoreBulletin
  },
  data () {
    return {
      searchText: ''
    }
  },
  methods: {
    onSearch: function (text) {
      this.navigation.navigate('SearchBookList', {searchText: text})
    },
    onScrollEnd: function (e) {
      if (e.nativeEvent.contentSize.height - 20 <= e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height) {
        this.$refs.GenderMoreBulletin.loadNextPage()
      }
    }
  }
}
</script>
<style scoped>
.container {
  padding: 10;
  background-color: #f0f0f0;
}
.bulletin {
  margin-top: 10;
  margin-bottom: 10;
}
</style>