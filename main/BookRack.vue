<template>
    <div class="book-rack">
        <RackMenuBar class="rack-menu-bar"></RackMenuBar>
        <RecomendCard class="recomend-card" ref="RecomendCard"></RecomendCard>
        <BookShelf class="book-shelf" ref="BookShelf"></BookShelf>
    </div>
</template>
<script>
import RackMenuBar from './RackMenuBar'
import RecomendCard from './RecomendCard'
import BookShelf from './BookShelf'
import { defaultBooks } from '../api/api.js'
module.exports = {
    components: {
        RackMenuBar,
        RecomendCard,
        BookShelf
    },
    created() {
        this.$on('books_ready', this.onBooks)
        this.getBooks()
    },
    methods: {
        getBooks() {
            defaultBooks().then(res => {
                if (200 == res.status && 'OK' == res.statusText) {
                    this.$emit('books_ready', res.data)
                }
            })
        },
        onBooks(books) {
            if (books.ok && 0 < books.total) {
                this.$refs.BookShelf.addBooks(books.books)
                this.$refs.RecomendCard.setRecomendBook(books.books[0])
            }
        }
    }
}
</script>
<style scoped>
.book-rack {
    height: 100%;
}
.rack-menu-bar {
    height: 10vh;
}
.recomend-card {
    margin-top: 10px;
    height: 30vh;
}
.book-shelf {
    margin-top: 20px;
    height: 50vh;
}
</style>