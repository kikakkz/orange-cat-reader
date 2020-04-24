import AsyncStorage from '@react-native-community/async-storage'

export const store = new Object({
  Save: function (k, v) {
    try {
      AsyncStorage.setItem(k, v)
    } catch (e) {
      console.log(e, k, v)
    }
  },
  Load: function (k) {
    try {
      return AsyncStorage.getItem(k)
    } catch (e) {
      console.log(e, k, 'GET')
      return null
    }
  },
  Remove: function (k) {
    try {
      AsyncStorage.removeItem(k)
    } catch (e) {
      console.log(e, k, 'REMOVE')
    }
  }
})