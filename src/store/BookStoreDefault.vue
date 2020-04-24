<template>
  <view class="container">
    <scroll-view
      :on-momentum-scroll-end="(e) => onScrollEnd(e)">
      <Carousel :navigation="navigation"
        :uris="createdObjects[0].obj.uris" :height="carouselHeight"></Carousel>
      <template v-for="(obj, index) in goodObjects">
        <ScoreBulletinBook :navigation="navigation" class="good-book-recommend"
          :key="index" :height="goodBookHeight" :book="obj.obj.book"></ScoreBulletinBook>
      </template>
      <activity-indicator v-if="loadingNewBook" size="large" color="orange"></activity-indicator>
      <text class="all-loaded" v-if="allGoodBooksLoaded">已经加载所有书籍~~ </text>
    </scroll-view>
    <view class="page-loading" :style="{height: screenHeight, width: screenWidth}">
      <activity-indicator v-if="loadingPage" size="large" color="orange"></activity-indicator>
    </view>
  </view>
</template>
<script>
import Carousel from '../utils/Carousel'
const { api } = require('../api/api')
const { bookOp } = require('../book/book-functions')
import { px2dp } from '../utils/screen-utils'
import { CarouselObject, ActGotoReader } from '../utils/carousel-utils'
import { ScrollObject } from '../utils/scroll-pos'
import HotBulletin from '../bulletin/HotBulletin'
import ScoreBulletin from '../bulletin/ScoreBulletin'
import ScoreBulletinBook from '../bulletin/ScoreBulletinBook'
import BulletinTitle from '../bulletin/BulletinTitle'
import { screenHeight, screenWidth } from '../utils/screen-utils'

var firstCreated = {}

export default {
  props: {
    navigation: Object,
    carouselClazz: String,
    bodyClazz: String,
    bodyKey: String
  },
  data () {
    return {
      carouselBooks: [],
      totalGoodBooks: [],
      carouselHeight: px2dp(140),
      hotBulletinHeight: px2dp(360),
      scoreBulletinHeight: px2dp(380),
      goodBookHeight: px2dp(100),
      carouselCount: 12,
      
      loadingPage: false,
      loadingNewBook: false,
      currentGoodBookPage: 1,
      allGoodBooksLoaded: false,
      
      currentRenderNewBooks: 10,
      currentRenderCycle: 0,

      screenHeight: screenHeight,
      screenWidth: screenWidth
    }
  },
  components: {
    Carousel,
    HotBulletin,
    ScoreBulletin,
    ScoreBulletinBook,
    BulletinTitle
  },
  mounted () {
    this.$on('carousel_recommend_req', this.onCarouselRecommendRequest)
    this.$on('collect_recommend_req', this.onGoodRecommendRequest)

    this.initializeRequest()
  },
  methods: {
    toCreated: function () {
      firstCreated[this.gender + this.bulletin] = {
          totalGoodBooks: this.totalGoodBooks,
          carouselBooks: this.carouselBooks,
          currentGoodBookPage: this.currentGoodBookPage,
          allGoodBooksLoaded: this.allGoodBooksLoaded
        }
    },
    extendNewBooks: function () {
      var obj = firstCreated[this.gender + this.bulletin]

       if (obj.totalGoodBooks.length <= this.currentRenderNewBooks * this.currentRenderCycle) {
          return
        }
        this.totalGoodBooks = this.totalGoodBooks.concat(
          obj.totalGoodBooks.slice(
          this.currentRenderNewBooks * this.currentRenderCycle,
          this.currentRenderNewBooks * (this.currentRenderCycle + 1)))
        this.currentRenderCycle += 1

        setTimeout(this.extendNewBooks, 50)
    },
    fromCreated: function (obj) {
      this.carouselBooks = obj.carouselBooks
      this.currentRenderCycle = 0

      setTimeout(this.extendNewBooks, 50)

      this.currentGoodBookPage = obj.currentGoodBookPage
      this.allGoodBooksLoaded = obj.allGoodBooksLoaded
    },
    initializeRequest() {
      var obj = firstCreated[this.gender + this.bulletin]
      if (obj != undefined) {
        this.fromCreated(obj)
        this.loadingPage = this.loadingNewBook = false
        return
      }

      this.carouselBooks = []
      this.totalGoodBooks = []

      this.loadingPage = true
      this.loadingNewBook = false
      this.currentGoodBookPage = 1
      this.allGoodBooksLoaded = false

      this.$emit('carousel_recommend_req')

      this.topVisibleObjIndex = 0
    },
    getCarouselBooks: function () {
      api.booksByClazz(this.carouselClazz)
      .then((res) => {
        var data = api.parseApiResponse(res)
        if (data.code != 0) {
          console.error(data.error, res.config.url)
          return
        }
        this.carouselBooks = bookOp.booksFromApiResponse(data)
        this.$emit('collect_recommend_req')
      })
      .catch((e) => {
        console.log(e)
      })
    },
    getRecommendBooks: function () {
      this.loadingNewBook = true
      api.booksByClazzPageQuery(this.bodyClazz, this.currentGoodBookPage, this.bodyKey)
      .then((res) => {
        var data = api.parseApiResponse(res)
        if (data.code != 0) {
          console.error(data.error, res.config.url)
          return
        }

        this.loadingNewBook = false
        this.loadingPage = false

        var books = bookOp.booksFromApiResponse(data)
        this.totalGoodBooks = this.totalGoodBooks.concat(books)
        if (0 === books.length) {
          this.allGoodBooksLoaded = true
        } else {
          this.currentGoodBookPage += 1
        }
      })
      .catch((e) => {
        console.log(e)
      })
    },
    onCarouselRecommendRequest: function () {
      this.getCarouselBooks()
    },
    onGoodRecommendRequest: function () {
      this.getRecommendBooks()
    },
    onScrollEnd: function (e) {
      if (this.allGoodBooksLoaded) {
        return
      }
      if (e.nativeEvent.contentSize.height - 20 <= e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height) {
        this.loadingNewBook = true
        this.$emit('collect_recommend_req')
      }
    }
  },
  computed: {
    carouselUris: function () {
      var uris = []
      for (var i in this.carouselBooks) {
        uris.push(new CarouselObject(
          this.carouselBooks[i].coverUri(), null,
          ActGotoReader, this.carouselBooks[i]))
      }
      return uris
    },
    createdObjects: function () {
      var objects = []
      this.scrollViewHeight = 0

      this.headerCount = 0

      objects.push(new ScrollObject(0, this.carouselHeight, {uris: this.carouselUris}))
      this.scrollViewHeight += this.carouselHeight
      this.headerCount += 1

      for (var i in this.totalGoodBooks) {
        objects.push(new ScrollObject(this.scrollViewHeight, this.goodBookHeight, {book: this.totalGoodBooks[i]}))
        this.scrollViewHeight += this.goodBookHeight
      }

      return objects
    },
    goodObjects: function () {
      if (this.createdObjects.length <= this.headerCount) {
        return []
      }
      return this.createdObjects.slice(this.headerCount)
    },
    scrollViewAreaTop: function () {
      var objects = this.createdObjects
      var viewTop = 0
      for (var i = 0; i < objects.length; i++) {
        if (i < this.topVisibleObjIndex) {
          viewTop += objects[i].height
          continue
        }
        break
      }
      return viewTop
    }
  },
  watch: {
    gender: function () {
      this.initializeRequest()
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
}
.good-book-recommend {
  margin: 10;
}
.page-loading {
  position: absolute;
  justify-content: center;
}
.all-loaded {
  height: 50;
  line-height: 50;
  font-size: 12;
  text-align: center;
}
.good-book-title {
  padding-left: 10;
  padding-right: 10;
}
</style>
