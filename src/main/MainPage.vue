<template>
  <view class="container">
    <nb-tabs
      :render-tab-bar="() => renderTabbar()" :initialPage="1"
      :page="currentPage" :locked=true>
      <nb-tab heading="~~">
        <BookShelf ref="BookShelf" @gotorecommend="onGotoRecommend" :navigation="navigation" class="main-body"></BookShelf>
      </nb-tab>
      <nb-tab heading="~~">
        <BookStore ref="BookStore" :navigation="navigation" class="main-body"></BookStore>
      </nb-tab>
      <nb-tab heading="~~">
        <Election :navigation="navigation" class="main-body"></Election>
      </nb-tab>
      <nb-tab heading="~~">
        <Mine @gotorecommend="onGotoRecommend" ref="Mine" :navigation="navigation" class="main-body"></Mine>
      </nb-tab>
    </nb-tabs>
    <MainTabBar @maintabswitch="onTabSwitch" :currenttab="current"></MainTabBar>
  </view>
</template>
<script>
import React from 'react'
import { View } from 'react-native'

import MainTabBar from './MainTabBar'
import BookShelf from '../book/BookShelf'
import BookStore from '../store/BookStore'
import Mine from '../mine/Mine'
import Election from '../election/Election'

export default {
  props: {
    navigation: Object
  },
  data () {
    return {
      currentPage: 1,
      tabs: [MainTabBookShelf, MainTabBookStore, MainTabElection, MainTabMine],
    }
  },
  components: {
    MainTabBar,
    BookShelf,
    BookStore,
    Mine,
    Election
  },
  methods: {
    onTabSwitch: function (tab) {
      this.currentPage = this.tabs.indexOf(tab)
      if (undefined != this.$refs.BookStore) {
        this.$refs.BookStore.reset()
      }
      if (undefined != this.$refs.BookShelf && tab === MainTabBookShelf) {
        this.$refs.BookShelf.enter()
      }
      if (undefined != this.$refs.Mine) {
        this.$refs.Mine.reset()
      }
    },
    renderTabbar: function () {
      return (<View style={{height: 0}}></View>)
    },
    onGotoRecommend: function () {
      if (undefined != this.$refs.BookStore) {
        this.$refs.BookStore.reset()
      }
      this.currentPage = this.tabs.indexOf(MainTabBookStore)
    }
  },
  computed: {
    current: function () {
      return this.tabs[this.currentPage]
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
}
.main-body {
  flex: 1;
}
</style>