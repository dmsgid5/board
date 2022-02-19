<template>
    <div>
        <h3>게시글 작성</h3>
        <input v-model="board.title" type="text" placeholder="제목을 입력하세요">
        <input v-model="board.contents" type="text" placeholder="내용을 입력하세요">
        <input v-model="board.author" type="text" placeholder="작성자명을 입력하세요">
        <button @click="submitBtn">작성완료</button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                board: {
                    title: '',
                    contents: '',
                    author: ''
                }
            }
        },
        methods: {
            submitBtn () {
                console.log(this.board);
                this.$axios.post('/api/regist', this.board).then((res) => {
                    console.log(res);
                    if(res.data.result == "OK") {
                        alert('게시글이 정상적으로 등록되었습니다.');
                        this.$router.push('/board');
                    }else {
                        alert('잠시후 다시 시도해주세요.')
                    }
                })
            }
        }
    }
</script>