<template>
  <touchable-opacity class="score-book-container" :style="{height: height}"
    :on-press="() => onBookPress()" :on-long-press="() => onBookLonePress()">
    <image class="score-book-cover" :source="{uri: book.coverUri()}"
      :style="{width: height * 0.75, height: height}"></image>
    <view class="score-book-info-container">
      <view class="score-book-title score-book-info">
        <text class="score-book-left score-book-name">{{ book.name() }}</text>
        <text class="score-book-right score-book-score">{{ book.score() }}</text>
      </view>
      <view class="score-book-abbreviation-container" :style="{height: lineHeight * 3}">
        <text class="score-book-abbreviation"
          :style="{lineHeight: lineHeight, fontSize: fontSize}">
          {{ book.abbreviation() }}
        </text>
      </view>
      <view class="score-book-extra score-book-info">
        <text class="score-book-left score-book-bottom score-book-arthor">{{ book.author() }}</text>
        <text class="score-book-right score-book-bottom score-book-clazz">{{ book.clazzName() }}</text>
      </view>
    </view>
  </touchable-opacity>
</template>
<script>
export default {
  props: ['height', 'book', 'navigation'],
  data () {
    return {
      lineHeight: 18,
      fontSize: 12
    }
  },
  methods: {
    onBookPress: function () {
      this.navigation.navigate('Reader', {book: this.book})
    },
    onBookLonePress: function () {
      this.$emit('booklongpress')
    }
  }
}
</script>
<style scoped>
.score-book-container {
  flex: 1;
  flex-direction: row;
  margin-top: 8;
  margin-bottom: 8;
}
.score-book-cover {
  margin-right: 10;
}
.score-book-info {
  flex-direction: row;
  justify-content: space-evenly;
  align-self: stretch;
}
.score-book-title {
  background-color: transparent;
  font-weight: bold;
}
.score-book-extra {
  background-color: transparent;
}
.score-book-info-container {
  flex: 1;
}
.score-book-left {
  flex: 1;
  text-align: left;
}
.score-book-right {
  text-align: right;
}
.score-book-abbreviation-container {
  background-color: transparent;
}
.score-book-abbreviation {
  color: #5a5a5a;
  flex: 1;
}
.score-book-name {
  font-size: 14;
  color: black;
}
.score-book-score {
  color: orange;
  font-weight: bold;
  font-size: 18;
}
.score-book-bottom {
  font-size: 10;
  margin-top: 5;
}
.score-book-clazz {
  background-color: orange;
  border-radius: 4;
  padding: 2;
}
.score-book-arthor {
  color: blue;
}
</style>
