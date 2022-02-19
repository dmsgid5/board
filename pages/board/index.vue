<template>
    <div>
        <!-- <div>{{paramsData}}</div> -->
        <h3>게시판</h3>
        <table>
            <thead>
                <th>넘버</th>
                <th>타이틀</th>
                <th>내용</th>
                <th>작성자</th>
                <th>작성일</th>
                <th></th>
            </thead>
            <tbody>
                <tr v-for="board in boardList" :key="board.idx">
                    <td>{{board.idx}}</td>
                    <td @click="goDetail(board.idx)">{{board.title}}</td>
                    <td>{{board.contents}}</td>
                    <td>{{board.author}}</td>
                    <td>{{board.regdate}}</td>
                    <td>
                        <button @click="listDelete(board.idx)">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <br>
        <button @click="goMenuLink('/board/regist')">게시글 작성</button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                boardList: [],
                // paramsData : '',
            }
        },
        mounted() { //로드 될때 실행
            console.log(this.$route)
            //params 로 받은 데이터 로컬데이터에 저장
            // if(this.$route.params.data){ //만약 파람이 있으면 
            //     this.paramsData = this.$route.params.data;
            // }else{
            //     this.$router.push('/');
            // }
            
            this.listMounted();
        },
        methods: {
            listMounted() {
                this.$axios.get('/api/allBoard').then((res)=>{
                    // console.log(res)
                    if(res.data.result == "OK") {
                        this.boardList = res.data.data;
                    }else {
                        res.data.result = "FAIL"
                    }
                })
            },
             goDetail (boardNum) {
                this.$router.push('/board/detail?board_number='+boardNum);
            },
            listDelete(index) { //back에 메뉴 삭제 요청
                this.$axios.delete('/api/listDelete', {
                    data: {
                        idx: index
                    }
                }).then((res)=> {
                    console.log(res);
                    if(res.data.result == "OK") {
                        alert('삭제되었습니다.');
                        this.listMounted();
                    }else {
                        alert('다시 시도해주세요.')
                    }
                })
            },
            goMenuLink(path) {
                this.$router.push(path)
            }
        }
    }
</script>