<template>
  <app-navigator></app-navigator>
</template>
<script>
import { createAppContainer, createStackNavigator } from 'vue-native-router'

import MainPage from '../main/MainPage'
import Reader from '../reader/Reader'
import BulletinBookList from '../bulletin/BulletinBookList'
import SearchBookList from '../search/SearchBookList'

const StackNavigator = createStackNavigator(
  {
    Home: { screen: MainPage },
    Reader: { screen: Reader },
    BulletinBookList: { screen:  BulletinBookList},
    SearchBookList: { screen: SearchBookList }
  }, {
    initialRouterName: 'Home',
    headerMode: 'none'
  }
)

const AppNavigator = createAppContainer(StackNavigator)

export default {
  components: { AppNavigator }
}
</script>
<style scoped>
</style>
