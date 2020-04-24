<template>
    <el-card class="recomend-card">
        <img class="recomend-poster" :src="book.cover" />
        <p class="recomend-hint">{{ book.shortIntro }}</p>
    </el-card>
</template>
<script>
module.exports = {
    data() {
        return {
            book: {}
        }
    },
    methods: {
        setRecomendBook(book) {
            this.book = book
        }
    }
}
</script>
<style scoped>
.recomend-hint {
    font-size: 3vw;
    margin: 0 0 0 3vw;
}
.recomend-poster {
    position: absolute;
    height: 10vw;
    width: 10vw;
    left: 3vw;
    background: url("../assets/logo.jpg");
    background-size: 10vw 10vw;
}
.recomend-card {
    height: 15vh;
    margin-left: 5vw;
}
</style>