<template>
    <div class="banner-area" align="center">
        <div class="banner">
            <img class="banner-logo" src="../assets/banner.png"/>
        </div>
    </div>
</template>
<script>
module.exports = {}
</script>
<style scoped>
.banner-logo {
    width: 100%;
    height: 80px;
    background: red;
}
.banner-text {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 2.8vw;
    line-height: 30px;
    margin: 2px 0 2px 5px;
}
.banner {
    display: flex;
    height: 30px;
    margin: 0 auto;
}
.banner-area {
    width: 100%;
}
</style>