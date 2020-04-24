<template>
    <div class="book-card-row">
        <BookCardMain class="book-card" v-for="book in books" :key="book._id" :book="book"></BookCardMain>
    </div>
</template>
<script>
import BookCardMain from '../book/BookCardMain'
module.exports = {
    props: ['books'],
    components: {
        BookCardMain
    },
    data() {
        return {}
    }
}
</script>
<style scoped>
.book-card-row {
    display: flex;
}
.book-card {
    width: 30vw;
}
</style>