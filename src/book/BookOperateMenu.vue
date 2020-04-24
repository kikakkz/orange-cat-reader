<template>
  <view class="container">
    <BookShelfToolBar class="toolbar" :style="{top: toolbartop}"
      @allselected="onAllSelected" @delete="onDelete" @close="onClose"></BookShelfToolBar>
  </view>
</template>
<script>
import BookShelfToolBar from './BookShelfToolBar'
import { EvAllSelected, EvDelete, EvClose } from './book-event'

export default {
  props: ['toolbartop'],
  components: {
    BookShelfToolBar
  },
  methods: {
    onAllSelected: function (selected) {
      this.$emit(EvAllSelected, selected)
    },
    onDelete: function () {
      this.$emit(EvDelete)
    },
    onClose: function () {
      this.$emit(EvClose)
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
  background-color: rgba(00, 00, 00, 0.2)
}
.toolbar {
  position: absolute;
}
</style>
