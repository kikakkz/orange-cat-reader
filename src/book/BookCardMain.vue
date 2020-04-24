<template>
  <view class="book-row">
    <touchable-opacity class="book-card-btn" :on-press="() => onBookPress()"
      :on-long-press="onBookCardLongPress">
      <ImageCard class="book-card" :height=140 :uri="coverImgUri" :local=false :flex=1 />
      <touchable-opacity class="book-delete-btn" :on-press="() => onBookOperateBtnClick()">
        <image class="book-delete-btn" v-if="waitSelecting" :source="operateImageUri"></image>
      </touchable-opacity>
      <text class="book-name" v-if="showBookName">{{ bookName }}</text>
    </touchable-opacity>
  </view>
</template>
<script>
import ImageCard from '../utils/ImageCard'
import { EvBookLongPress, EvSelected } from './book-event'

export default {
  props: {
    book: Object,
    navigation: Object,
    waitSelecting: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    operatable: {
      type: Boolean,
      default: true
    },
    showBookName: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ImageCard
  },
  data () {
    return {
      waitOperated: false,
      coverImgUri: this.book.coverUri(),
      bookName: this.book.name()
    }
  },
  methods: {
    onBookPress: function () {
      if (this.waitSelecting) {
        this.onBookOperateBtnClick()
        return
      }
      this.navigation.navigate('Reader', {book: this.book})
    },
    onBookCardLongPress: function () {
      if (!this.operatable) {
        return
      }

      if (this.waitSelecting) {
        return
      }
      
      this.$emit(EvBookLongPress, {book: this.book, obj: this})

      this.waitSelecting = true
      this.waitOperated = true
    },
    onBookOperateBtnClick: function () {
      this.waitOperated = !this.waitOperated
      this.$emit(EvSelected, {book: this.book, obj: this, selected: this.waitOperated})
    }
  },
  computed: {
    operateImageUri: function () {
      return this.waitOperated ? require('../icons/Selected.png') : require('../icons/Unselected.png')
    }
  },
  watch: {
    selected: function () {
      this.waitOperated = this.selected
    },
    book: function () {
      this.coverImgUri = this.book.coverUri()
      this.bookName = this.book.name()
    },
    waitSelecting: function () {
      if (!this.waitSelecting) {
        this.selected = this.waitOperated = false
      }
    }
  }
}
</script>
<style scoped>
.book-row {
  flex-direction: row;
}
.book-card {
  flex: 1;
  height: 140;
}
.book-card-btn {
  flex: 1;
}
.book-delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 20;
  height: 20;
}
.book-name {
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 20;
  color: #0000ffc0;
  font-size: 10;
  margin: 5;
}
</style>
