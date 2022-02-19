<template>
    <div>
        <h3>메뉴 리스트</h3>
        <ul>
            <li v-for="menu in menuList" :key="menu.idx">
                <!-- <p>{{menu.idx}}</p> -->
                <input @click="check(menu)" type="checkbox">
                <img :src="'/uploads/' + menu.image" style="width: 100%;"/>
                <p>{{menu.menu_name}}</p>
                <p>{{menu.price}}원</p>
                <p>{{menu.contents}}</p>
            </li>
        </ul>
        <button @click="orderAct">주문하기</button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                menuList: [],
                checkArray: [] //check된 menu.idx가 있음.
            }
        },
        mounted() {
            // console.log(this.$route)
            this.$axios.get('/api/allMenu').then((res) => {
                console.log(res);
                if(res.data.result == "OK") {
                    this.menuList = res.data.data;
                }else {
                    this.$router.push('/restaurant');
                }
            });
        },
        methods: {
            check(menu) {
                console.log(menu);
                // checkArray에 있는지 없는지 체크(중복으로 담기는거 방지)
                // includes()는 문자열이 특정 문자열을 포함하는지 확인하는 메서드
                if(this.checkArray.includes(menu)) { //배열에 이미 들어있음
                    this.checkArray = this.checkArray.filter((menuIn)=>{
                        return menuIn !== menu;
                    })
                }else { //배열에 없으면 추가
                    this.checkArray.push(menu);
                }
                console.log(this.checkArray);
            },
            orderAct() { //주문하기 버튼을 눌렀을때
                this.$router.push(
                    {
                        name : 'restaurant-order',
                        params : 
                            { 
                                menu_list : this.checkArray
                            }
                        }
                    )
            }
        }
    }
</script>
<style scoped>
    ul {
        overflow: hidden;
        list-style: none;
        padding-left: 0 !important;
    }
    li {
        width: calc(25% - 11.25px);
        padding: 10px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        float: left;
        margin-right: 15px;
        margin-bottom: 15px;
        list-style: none;
    }
</style>