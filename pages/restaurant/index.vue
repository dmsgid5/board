<template>
    <div>
        <button @click="goMenuLink('/restaurant/menu')">메뉴보기</button>
        <button @click="goMenuLink('/board')">게시판</button>
        <button>내 주문내역</button>
    </div>
</template>
<script>
    export default {
        data () {
            return {

            }
        },
        mounted() {

        },
        methods: {
            goMenuLink(path) {
                this.$router.push(path);
            }
        }
    }
</script>
<style scoped>
    button {
        width: calc(33.3333% - 10px);
        height: 30px;
        background-color: #fff;
        border: 1px solid #858585;
        color: #3e3e3e;
        border-radius: 5px;
        margin-right: 15px;
        cursor: pointer;
        float: left;
        margin-top: 30px;
    }

    button:last-child {
        margin-right: 0;
    }
</style>