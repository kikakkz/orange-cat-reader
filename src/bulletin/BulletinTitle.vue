<template>
  <text class="bulletin-title" :on-layout="(e) => onLayout(e)">{{ title }}</text>
</template>
<script>
export default {
  props: ['title'],
  methods: {
    onLayout: function (e) {
      this.$emit('on-layout', e)
    }
  }
}
</script>
<style scoped>
.bulletin-title {
  font-size: 20;
  font-weight: bold;
  color: black;
  margin-left: 10;
  margin-top: 20;
  margin-bottom: 10;
}
</style>
