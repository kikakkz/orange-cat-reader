<template>
  <view class="recomend-card">
    <touchable-opacity class="card-content" :on-press="() => onRecommendBookPress()">
      <RecomendCard class="card-content" v-if="null != book"
        localCover=false :coverUri="book.coverUri()"
        :text="book.recommendWords()"
        :user="book.recommendUser()"></RecomendCard>
    </touchable-opacity>
  </view>
</template>>
<script>
import RecomendCard from '../utils/RecomendCard'
import { Book } from './book-functions'
export default {
  props: ['navigation'],
  components: {
    RecomendCard
  },
  data() {
    return {
      book: null
    }
  },
  methods: {
    setRecomendBook(book) {
      this.book = book
    },
    onRecommendBookPress() {
      this.navigation.navigate('Reader', {book: this.book})
    }
  }
}
</script>
<style scoped>
.recomend-card {
  flex: 1;
}
.card-content {
  flex: 1;
}
</style>
