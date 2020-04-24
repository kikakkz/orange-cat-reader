<template>
    <div>
        <BookCardRow v-for="(books, index) in booksByRow" :key="index" :books="books"></BookCardRow>
    </div>
</template>
<script>
import BookCardRow from '../book/BookCardRow'
module.exports = {
    components: {
        BookCardRow
    },
    data() {
        return {
            booksByRow: null
        }
    },
    methods: {
        addBooks: function(books) {
            var booksByRow = new Array()
            for (var i in books) {
                var rowIdx = Math.floor(i / 3)
                if (0 == i % 3) {
                    booksByRow[rowIdx] = new Array();
                }
                booksByRow[rowIdx].push(books[i])
            }
            this.booksByRow = booksByRow
        }
    }
}
</script>
<style scoped>
</style>