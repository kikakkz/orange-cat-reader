<template>
  <view class="search-bar">
    <text-input :placeholder="placeHolder" class="search-input" v-model="searchText"></text-input>
    <touchable-opacity class="search-btn-container" :on-press="() => onSearch()">
      <image class="search-btn" :source="require('../icons/Search.png')"></image>
    </touchable-opacity>
  </view>
</template>
<script>

const EvSearch = 'search'

export default {
  props: ['initialSearchText', 'placeHolder'],
  data () {
    return {
      searchText: this.initialSearchText
    }
  },
  methods: {
    onSearch: function () {
      if (undefined == this.searchText || 0 === this.searchText.length) {
        this.searchText = ''
      }
      this.$emit(EvSearch, this.searchText)
    }
  }
}
</script>
<style scoped>
.search-bar {
  height: 30;
  flex-direction: row;
  margin-bottom: 10;
}
.search-input {
  border-color: lightgray;
  border-width: 1px;
  border-radius: 4;
  flex: 1;
  padding: 2;
}
.search-btn-container {
  padding: 5;
}
.search-btn {
  width: 20;
  height: 20;
}
</style>
