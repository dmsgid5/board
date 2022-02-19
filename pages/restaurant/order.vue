<template>
    <div>
        <h3>주문서</h3>
        <ul>
            <li v-for="menu in menuList" :key="menu.idx">
                <img :src="'/uploads/' + menu.image" style="width: 50px;" class="floatL"/>
                <p class="floatL">메뉴 이름 : {{menu.menu_name}}</p>
                <p class="floatL">메뉴 금액 : {{menu.price}}원</p>
                <p class="floatL">메뉴 설명 : {{menu.contents}}</p>
            </li>
        </ul>
        <div class="totalPrice">
            총 금액 : {{totalPrice}}원
        </div>
        <br>
        <button @click="payment">결제하기</button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                menuList: [],
                totalPrice: 0
            }
        },
        mounted() {
            console.log(this.$route.params.menu_list);
            if(this.$route.params.menu_list){
                this.menuList = this.$route.params.menu_list;
            }else{
                alert('새로고침하면 뒤로가지롱');
                // 값이 없으면 뒤로가기
                this.$router.go(-1);
            }

            // console.log('this is map')
            // 배열.map((요소, 인덱스, 배열) => { return 요소 });
            // this.totalPrice = this.menuList.map((item)=>{
            //     console.log(item.price);
            // })
            
            console.log('this is reduce')
            // (누적값, 새로운값)
            this.totalPrice = this.menuList.reduce((sum, val)=>{
                console.log(sum + "sum");
                console.log(val.price + "price");
                
                return sum + val.price;
            },0)

            console.log(this.totalPrice)
        },
        methods: {
            payment() {
                confirm('결제를 진행하시겠습니까?')
                console.log('OK');
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
        padding: 10px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        float: left;
        margin-right: 15px;
        margin-bottom: 15px;
        list-style: none;
        display: flex;
        align-items: center;
    }
    .floatL {
        float: left;
        margin-right: 50px;
    }
    .totalPrice {
        font-size: 20px;
        font-weight: 700;
        color: red;
    }
</style>