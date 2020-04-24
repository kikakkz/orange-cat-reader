<template>
    <div class="main-menu">
        <div class="weekly-read-info">
            <p>本周已读 <b><font size="5vw">{{ weeklyReadMins }}</font></b> 分钟</p>
        </div>
        <div class="menu-button">
            <img class="menu-button-img" src="../assets/logo.jpg" />
            <img class="menu-button-img" src="../assets/logo.jpg" />
            <img class="menu-button-img" src="../assets/logo.jpg" />
        </div>
    </div>
</template>
<script>
module.exports = {
    data() {
        return {
            weeklyReadMins: 0
        }
    }
}
</script>
<style scoped>
.main-menu {
    display: flex;
}
.weekly-read-info {
    display: table-cell;
    width: 65vw;
    margin: 2px 0 2px 0;
    height: 10vw;
}
p {
    line-height: 10vw;
    font-size: 3vw;
    margin: 0 0 0 0;
    font-family: Arial, Helvetica, sans-serif;
}
.menu-button {
    float: right;
    width: 35vw;
    height: 10vw;
}
.menu-button-img {
    width: 10vw;
    height: 10vw;
    background: blue;
}
</style>