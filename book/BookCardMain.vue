<template>
    <div class="el-card">
        <img class="book-card-main" :src="book.cover"/>
    </div>
</template>
<script>
module.exports = {
    props: ['book'],
    data() {
        return {}
    }
}
</script>
<style scoped>
.book-card-main {
    background: url("../assets/logo.jpg");
    background-size: 33vw 40vw;
    width: 30vw;
    height: 40vw;
    margin: 0;
    padding: 0;
}
</style>