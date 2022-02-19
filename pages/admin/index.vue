<template>
    <div>
        <h3>메뉴 등록</h3>
        <!-- {{menu}} -->
        <table>
            <thead>
                <th>NO</th>
                <th>이미지</th>
                <th>메뉴이름</th>
                <th>가격</th>
                <th>설명</th>
                <th></th>
            </thead>
            <tbody>
                <tr>
                    <td>NO.</td>
                    <td>

                        <button v-if="!imagePreview" @click="openImgUpload">이미지 업로드</button>
                        <img v-else :src="imagePreview" style="width: 400px;"/>
                    </td>
                    <td>
                        <input v-model="menu.menu_name" type="text" placeholder="메뉴 이름">
                    </td>
                    <td>
                        <input v-model="menu.price" type="text" placeholder="메뉴 가격">
                    </td>
                    <td>
                        <input v-model="menu.contents" type="text" placeholder="메뉴 설명">
                    </td>
                    <td>
                        <button @click="menuRegist">등록</button>
                    </td>
                </tr>
                <tr v-for="menu in menuList" :key="menu.idx">
                    <td>{{menu.idx}}</td>
                    <td>
                        <img :src="'/uploads/' + menu.image" style="width: 200px;"/>
                    </td>
                    <td>{{ menu.menu_name }}</td>
                    <td>{{ menu.price }}원</td>
                    <td>{{ menu.contents }}</td>
                    <td>
                        <button @click="listDelete(menu.idx)">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <input type="file" name="photo" ref="imgInput" @change="uploadImg" style="display : none;" multiple>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                menu: {
                    menu_name: '',
                    price: '',
                    contents: ''
                },
                menuList: [],
                image : {},
                imagePreview : '',
            }
        },
        mounted() {
            // 새로고침 될때마다 BACK에 최신 리스트 요청
            this.listRoad();
        },
        methods: {
            listRoad() { //BACK에 최신 리스트 요청
                this.$axios.get('/api/allMenu').then((res)=> {
                    console.log(res);
                    if(res.data.result == "OK") {
                        this.menuList = res.data.data;
                    }else {
                        res.data.result = "FAIL"
                    }
                })
            },
            uploadImg(e){ //이미지 change 이벤트
                console.log(e)
                console.log(e.target.files)
                const file = e.target.files[0];
                console.log("FILE UPLOAD")
                console.log(file)

                this.image = file;
                // 우리가 읽을 수 있는 url로 만들어 줌
                this.imagePreview = URL.createObjectURL(file)
                console.log(this.imagePreview)

                
            },
            openImgUpload(){ //버튼 클릭할때 imgInput이라는 file input이 클릭되는 거랑 같음
                this.$refs.imgInput.click()
            },
            menuRegist() {
                // 멀터를 쓸건데 멀터의 조건 중 하나가 FormData에 넣어주는 것이다.
                const formData = new FormData()
                formData.append('files', this.image)
                formData.append('menu',JSON.stringify(this.menu))

                this.$axios.post('/api/menu_registe', formData,{
                        // headers는 멀티파트 폼데이터라고 알려줌. (이렇게 넣어줘야 받는 애가 폼데이터라고 암)
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then((res) => {
                    console.log(res);
                    // var file = this.$refs.img.files;
                    // 메뉴 리스트로 데이터 넘겨주기
                    // this.$router.push({name: 'restaurant-menu', params: { data: this.menu}});

                    if(res.data.result == "OK") {
                        alert('메뉴가 정상적으로 등록되었습니다.');
                        this.listRoad();
                    }else {
                        alert('다시 시도해주세요.')
                    }
                })
            },
            listDelete (index) { //BACK에 리스트 삭제 요청
                console.log('aa');
                this.$axios.delete('/api/menuDelete',{
                    data: {
                        idx: index
                    }
                }).then((res)=>{
                    if(res.data.result == "OK") {
                        alert('메뉴가 삭제되었습니다.');
                        this.listRoad();
                    }else{
                        alert('다시 시도해주세요.')
                    }
                })
            }
        }
    }
</script>