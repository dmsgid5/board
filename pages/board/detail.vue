<template>
    <div>
        <input type="text" v-model="board.idx" disabled><br><br>
        <input type="text" v-model="board.title" :disabled="modiState == false" :class="{abledClass : !modiState }"><br><br>
        <input type="text" v-model="board.contents" :disabled="modiState == false" :class="{abledClass : !modiState }"><br><br>
        <input type="text" v-model="board.author" :disabled="modiState == false" :class="{abledClass : !modiState }"><br><br>
        <input type="text" v-model="board.regdate" disabled><br><br>
        <button @click="reviseAct">수정하기</button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                board:{
                    idx: '',
                    title: '',
                    contents: '',
                    author: '',
                    regdate: '',
                },
                modiState: false
            }
        },
        mounted() {
            // console.log(this.$route.query.board_number);
            var boardNum = this.$route.query.board_number;
            
            this.$axios.get('/api/board', {
                params: {
                    idx: boardNum
                }
            }).then((res)=>{
                console.log('this is mounted RES');
                console.log(res);
                if(res.data.result == "OK") {
                    this.board = res.data.data[0];
                }else {
                    this.board = {}
                }
            })
        },
        methods: {
            reviseAct() {
                if(!this.modiState){
                    this.modiState = true
                } else {
                    this.$axios.put('/api/revise/', {
                        updateData: this.board
                    }).then((res)=> {
                        // 수정 완료 후 처리 하기
                        console.log(res);
                    })
                }
            }
        }
    }
</script>
<style>
.abledClass{
    border:none !important;
    background: white !important;
}
</style>