<template>
    <div class="main-page">
        <router-view></router-view>
        <TabBar class="tab-bar"></TabBar>
    </div>
</template>
<script>
import TabBar from './TabBar'
module.exports = {
    components: {
        TabBar
    }
}
</script>
<style scoped>
.tab-bar {
    position: absolute;
    bottom: 0%;
}
.main-page {
    height: 100%;
}
</style>