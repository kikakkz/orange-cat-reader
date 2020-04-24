<template>
  <view class="container">
    <BookStoreHeaderMenu @catswitch="onCategorySwitch"
      :currentcategory="currentCategory" :navigation="navigation"></BookStoreHeaderMenu>
    <nb-tabs
      :tabBarUnderlineStyle="{backgroundColor: 'orange'}"
      :render-tab-bar="() => renderTabbar()" :initialPage="initialPage"
      :page="currentPage" :on-change-tab="({i}) => onChangeTab(i)">
      <nb-tab v-for="(p, index) in tabsParam" :key="index" :heading="p.headingText"
        :tabStyle="{backgroundColor: '#f0f0f0'}" :textStyle="{color: 'black', fontSize: 16, fontWeight: 'bold'}"
        :activeTabStyle="{backgroundColor: '#f0f0f0'}" :activeTextStyle="{color: 'black', fontSize: 20, fontWeight: 'bold'}">
        <BookStoreDefault
          :carouselClazz="p.carouselClazz"
          :bodyClazz="p.bodyClazz"
          :bodyKey="p.bodyKey"
          :navigation="navigation"></BookStoreDefault>
      </nb-tab>
      <nb-tab heading="分类"
        :tabStyle="{backgroundColor: '#f0f0f0'}" :textStyle="{color: 'black', fontSize: 16, fontWeight: 'bold'}"
        :activeTabStyle="{backgroundColor: '#f0f0f0'}" :activeTextStyle="{color: 'black', fontSize: 20, fontWeight: 'bold'}">
        <BookStoreClazz :navigation="navigation"></BookStoreClazz>
      </nb-tab>
      <nb-tab heading="追书"
        :tabStyle="{backgroundColor: '#f0f0f0'}" :textStyle="{color: 'black', fontSize: 16, fontWeight: 'bold'}"
        :activeTabStyle="{backgroundColor: '#f0f0f0'}" :activeTextStyle="{color: 'black', fontSize: 20, fontWeight: 'bold'}">
        <BookStoreMyWatch ref="BookStoreMyWatch" @gotorecommend="onGotoRecommend" :navigation="navigation"></BookStoreMyWatch>
      </nb-tab>
    </nb-tabs>
  </view>
</template>
<script>
import React from 'react'

import BookStoreHeaderMenu from './BookStoreHeaderMenu'
import BookStoreMyWatch from './BookStoreMyWatch'
import BookStoreClazz from './BookStoreClazz'
import BookStoreDefault from './BookStoreDefault'
import { View } from 'react-native'

export default {
  props: {
    navigation: Object,
    initialCategory: {
      type: String,
      default: CatRecommend
    }
  },
  data () {
    return {
      currentCategory: this.initialCategory,
      tabs: [CatRecommend, CatGirl, CatFinished, CatClazz, CatMyWatch],
      tabsParam: [
        {
          carouselClazz: 'fprecommend',
          bodyClazz: 'score',
          bodyKey: '',
          headingText: '推荐'
        }, {
          carouselClazz: 'girlrecommend',
          bodyClazz: 'chars',
          bodyKey: '',
          headingText: '女生'
        }, {
          carouselClazz: 'finishedrecommend',
          bodyClazz: 'reads',
          bodyKey: '',
          headingText: '全本'
        }
      ],
      initialPage: 0
    }
  },
  components: {
    BookStoreHeaderMenu,
    BookStoreDefault,
    BookStoreMyWatch,
    BookStoreClazz
  },
  created () {
    this.initialPage = this.tabs.indexOf(this.initialCategory)
  },
  methods: {
    onCategorySwitch: function (category) {
      this.currentCategory = category
    },
    renderTabbar: function () {
      return (<View style={{height: 0}}></View>)
    },
    onChangeTab: function (i) {
      this.currentCategory = this.tabs[i]
    },
    reset: function () {
      this.currentCategory = CatRecommend
    },
    onGotoRecommend: function () {
      this.reset()
    }
  },
  computed: {
    currentPage: function () {
      return this.tabs.indexOf(this.currentCategory)
    }
  },
  watch: {
    currentPage: function () {
      if (CatMyWatch === this.tabs[this.currentPage]) {
        if (this.$refs.BookStoreMyWatch != undefined) {
          this.$refs.BookStoreMyWatch.enter()
        }
      }
    }
  }
}
</script>
<style scoped>
.container {
  background-color: #f0f0f0;
}
.tab-header {
  background-color: #f0f0f0;
  color: black;
}
</style>
