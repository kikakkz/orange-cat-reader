<template>
  <view class="container">
    <view class="book-catalog-container">
      <touchable-opacity class="book-catalog-container"
        v-for="tab in tabs" :key="tab.category"
        :on-press="() => oncategorySwitch(tab.category)">
        <text :class="['book-catalog-base', (currentCategory === tab.category) ? 'book-catalog-active' : 'book-catalog']">
          {{ tab.title }}
        </text>
      </touchable-opacity>
    </view>
    <view class="func-btns">
      <touchable-opacity class="func-btn-container" :on-press="() => onSearch()">
        <image class="func-btn" :source="require('../icons/Search.png')"
          :style="{resizeMode: 'contain'}"></image>
      </touchable-opacity>
    </view>
  </view>
</template>
<script>

const EvCategorySwitch = 'catswitch'

CatFinished = 'finished'
CatGirl = 'girl'
CatRecommend = 'recommend'
CatMyWatch = 'my_watch'
CatClazz = 'clazz'
CatDefault = CatRecommend

export default {
  props: ['currentcategory', 'navigation'],
  data () {
    return {
      tabs: [
        {
          category: CatRecommend,
          title: '推荐'
        }, {
          category: CatGirl,
          title: '女生'
        }, {
          category: CatFinished,
          title: '完本'
        }, {
          category: CatClazz,
          title: '分类'
        }, {
          category: CatMyWatch,
          title: '追书'
        }
      ]
    }
  },
  methods: {
    oncategorySwitch: function (category) {
      this.currentCategory = category
      this.$emit(EvCategorySwitch, category)
    },
    onSearch: function () {
      this.navigation.navigate('SearchBookList', {searchText: ''})
    }
  },
  computed: {
    currentCategory: function () {
      if (undefined != this.currentcategory) {
        return this.currentcategory
      }
      return CatDefault
    }
  }
}
</script>
<style scoped>
.container {
  height: 50;
  flex-direction: row;
}
.book-catalog-container {
  flex: 8;
  flex-direction: row;
  margin-left: 10;
}
.book-catalog-base {
  flex: 1;
  line-height: 50;
  font-weight: bold;
  color: black;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
}
.book-catalog {
  font-size: 16;
}
.book-catalog-active {
  border-bottom-color: orange;
  border-bottom-width: 4px;
  font-size: 20;
}
.func-btns {
  flex: 2;
  height: 50;
  align-items: flex-end;
}
.func-btn-container {
  flex: 1;
  width: 50;
  height: 50;
  margin: 15;
}
.func-btn {
  flex: 1;
}
</style>
