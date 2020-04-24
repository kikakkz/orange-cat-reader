<template>
  <view class="score-container">
    <BulletinTitle :title="title"></BulletinTitle>
    <ScoreBulletinBook :navigation="navigation" class="score-book"
      v-for="(book, index) in scoreBooks" :key="index"
      :book="book" :height="100"></ScoreBulletinBook>
  </view>
</template>
<script>
import ScoreBulletinBook from './ScoreBulletinBook'
import BulletinTitle from './BulletinTitle'

export default {
  props: ['books', 'title', 'navigation'],
  data () {
    return {
      totalBooks: 3
    }
  },
  components: {
    BulletinTitle,
    ScoreBulletinBook
  },
  created () {
  },
  computed: {
    readyToShow: function () {
      return (this.books != null && this.books != undefined && 0 < this.books.length)
    },
    scoreBooks: function () {
      if (!this.readyToShow) {
        return []
      }
      return this.books.slice(0, 3)
    }
  }
}
</script>
<style scoped>
.score-container {
  background-color: transparent;
  padding: 10;
}
.score-book {
  flex: 1;
}
</style>
