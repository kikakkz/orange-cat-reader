<template>
  <touchable-opacity :on-press="() => onSwitch()">
    <view class="container" :on-layout="(e) => onLayout(e)">
      <text :class="[0 == activeItem ? 'text-active' : '', 'text-normal', 'text-left']"
        :style="{lineHeight: itemHeight}">{{ item1Text }}</text>
      <text :class="[1 == activeItem ? 'text-active' : '', 'text-normal', 'text-right']"
        :style="{lineHeight: itemHeight}">{{ item2Text }}</text>
    </view>
  </touchable-opacity>
</template>
<script>

const EvItemActive = 'itemactive'

export default {
  props: ['item1Text', 'item2Text', 'activeItemText'],
  data () {
    return {
      activeItem: this.activeItemText === this.item1Text ? 0 : 1,
      itemText: [this.item1Text, this.item2Text],
      itemHeight: 0
    }
  },
  methods: {
    onLayout: function (e) {
      this.itemHeight = e.nativeEvent.layout.height
    },
    onSwitch: function () {
      this.activeItem = (0 === this.activeItem) ? 1 : 0
      this.$emit(EvItemActive, this.itemText[this.activeItem])
    }
  }
}
</script>
<style scoped>
.container {
  flex: 1;
  border-radius: 10;
  border-color: orange;
  border-width: 1px;
  margin: 5;
  flex-direction: row;
  align-items: center;
}
.text-active {
  background-color: orange;
}
.text-left {
  border-top-left-radius: 10;
  border-bottom-left-radius: 10;
}
.text-right {
  border-top-right-radius: 10;
  border-bottom-right-radius: 10;
}
.text-normal {
  flex: 1;
  text-align: center;
  font-size: 8;
}
</style>
