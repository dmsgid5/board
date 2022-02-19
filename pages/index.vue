<template>
  <div>
    <p>로그인</p>
    <input type="text" v-model="user_id" placeholder="아이디">
    <input type="password" v-model="user_pw" placeholder="비밀번호">
    <button @click="goToLogin">로그인</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user_id: '',
      user_pw: ''
    }
  },
  methods: {
    goToLogin() {
      console.log(this.user_id);
      console.log(this.user_pw);
      // console.log(this.$axios);
      this.$axios.post('/api/user/login',{id : this.user_id, pw : this.user_pw}).then((res)=> {
        console.log(res);
        if(res.data.result == "OK") {
          this.$router.push('/restaurant');

          //프론트에서 프론트로 데이터 전달하는 방법 

          // 쿼리 스트링으로 데이터 전달
          // this.$router.push('/board?hello=annyung');

          //parmas로 데이터 전달 -> 새로고침 시 데이터 휘발성 
          // var data = [
          //   {name : 'a', price : 1000},
          //   {name : 'b', price : 1000},
          //   {name : 'c', price : 1000},
          // ]
          // this.$router.push({name : 'board', params : { data : data} })
        }else {
          alert('로그인 실패')
        }
      })
      // 
    }
  }
}
</script>
