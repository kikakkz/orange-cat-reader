<template>
  <view class="tabbar-container">
    <touchable-opacity class="tabbar-btn-container" v-for="tab in tabs" :key="tab.id" :on-press="() => onTabActive(tab.id)">
      <image
        :style="{flex: 1, resizeMode: 'contain'}"
        :source="current === tab.id ? tab.activeIcon : tab.normalIcon" />
      <text class="tabbar-text"
        :style="{color: current === tab.id ?  '#faa90f' : '#8f8f8f'}">{{ tab.title }}</text>
    </touchable-opacity>
  </view>
</template>
<script>
EvMainTabSwitch = 'maintabswitch'
MainTabBookShelf = 'BookShelf'
MainTabBookStore = 'BookStore'
MainTabElection = 'Election'
MainTabMine = 'Mine'
export default {
  props: ['currenttab'],
  data () {
    return {
      MainTabBookShelf,
      MainTabBookStore,
      MainTabElection,
      MainTabMine,
      tabs: [
        {
          id: MainTabBookShelf,
          normalIcon: require('../icons/BookShelfNormal.png'),
          activeIcon: require('../icons/BookShelfSelected.png'),
          title: '书架'
        }, {
          id: MainTabBookStore,
          normalIcon: require('../icons/BookStoreNormal.png'),
          activeIcon: require('../icons/BookStoreSelected.png'),
          title: '书城'
        }, {
          id: MainTabElection,
          normalIcon: require('../icons/ElectionNormal.png'),
          activeIcon: require('../icons/ElectionSelected.png'),
          title: '榜单'
        }, {
          id: MainTabMine,
          normalIcon: require('../icons/MineNormal.png'),
          activeIcon: require('../icons/MineSelected.png'),
          title: '我的'
        }
      ]
    }
  },
  created () {
    this.onTabActive(this.current)
  },
  methods: {
    onTabActive: function (tab) {
      this.current = tab
      this.$emit(EvMainTabSwitch, tab)
    }
  },
  computed: {
    current: function () {
      if (undefined === this.currenttab) {
        return MainTabBookStore
      }
      return this.currenttab
    }
  }
}
</script>
<style scoped>
.tabbar-container {
  border-top-color: lightgray;
  border-top-width: 1px;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  background-color: white;
  padding: 8;
}
.tabbar-btn-container {
  flex: 1;
  align-items: center;
  height: 35;
}
.tabbar-text {
  font-size: 10;
  font-weight: bold;
}
</style>