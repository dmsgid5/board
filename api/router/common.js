const express = require('express')
const router = express.Router()
const commonController = require('../controller/common')
const middlewareCustom = require('../middleware1')
const db = require('../db');
const multer  = require('multer')
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'static/uploads/');
      },
    filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
    },
})

const upload = multer({ storage: storage })

///////////////////////가상 데이터로 연결////////////////////////

// 로그인
//미들웨어 예시(미들웨어는 여러개 사용 가능, 미들웨어 끝나고 다음 실행)
// router.post('/user/login', middlewareCustom.loginConsole, middlewareCustom.loginConsole, middlewareCustom.loginConsole, middlewareCustom.loginConsole commonController.loginProcess);
router.post('/user/login', middlewareCustom.loginConsole, commonController.loginProcess);

// var list = [
//     {no:'1', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'2', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'3', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'4', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'5', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'6', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'7', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'8', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'9', title:'제목', author:'향구', date:'21-10-14'},
//     {no:'10', title:'제목', author:'향구', date:'21-10-14'},
// ]

// router.get('/allBoard', (req,res)=>{
//     // console.log("this is all board");
//     res.send({result: "OK",data: list});
// })

// router.get('/board/:boardNum', (req,res)=>{
//     console.log(req.params.boardNum);
//     var idx = req.params.boardNum;
//     for(var i = 0; i < list.length; i++) {
//         if(list[i].no == idx) {
//             res.send({result: "OK", data : list[i]})
//             return;
//         }
//     }

//     res.send({result:"FAIL"});
// })

///////////////////////MySQL로 데이터로 연결////////////////////////
// 게시글 전체 리스트
router.get('/allBoard', commonController.allBoard);

//메뉴 전체 리스트
router.get('/allMenu', async (req, res) => {
    let sql = `
            SELECT
                idx, menu_name, price, contents,image 
            FROM
                menu
    `
    let result = await db.query({ sql });
    console.log(result);
    if (result.rows.length > 0) {
        res.send({ result: "OK", data: result.rows });
    } else {
        res.send({result: "FAIL"});
    }
})

//게시글 삭제
router.delete('/listDelete', async (req, res) => {
    console.log(req);
    const { idx } = req.body;
    let sql = `
        DELETE
        FROM
            allboard
        WHERE
            idx = ?
    `
    let params = [idx];
    let result = await db.query({ sql, params });
    console.log(result);
    if(result.state) {
        res.send({result: "OK"})
    }else {
        res.send({result: "FAIL"})
    }
})

// 메뉴 삭제
router.delete('/menuDelete', async (req, res) => { 
    const { idx } = req.body;
    // console.log(req.body);
    let sql = `
            DELETE
            FROM
                menu
            WHERE
                idx = ?
    `
    let params = [idx];
    let result = await db.query({ sql, params });
    console.log('this is result');
    console.log(result);
    if(result.state){
        res.send({ result: "OK"});
    }else{
        res.send({result : "FAIL"});
    }
})

// 게시글 상세
router.get('/board',async(req,res)=> {
    // 요청받은 파람의 넘버
    // console.log(req.params.boardNum)
    console.log(req);
    const { idx } = req.query;

    let sql = `
        SELECT
            idx, title, contents, author, regdate
        FROM
            allboard
        WHERE 
            idx = ?
        `
    let params = [idx]
    let result = await db.query({sql , params});
    // console.log(result)
    if(result.state){
        res.send({ result: "OK" , data: result.rows });
    }else{
        res.send({result : "FAIL"});
    }
    
})


// 게시글 작성
router.post('/regist', async (req, res) => {
    console.log('작성');
    console.log(req.body);
    let {title,contents,author} = req.body;

    let sql = `
        INSERT INTO
            allboard (title, contents, author,regdate)
        VALUES (?,?,?,now())
        `
    let params = [title,contents,author];
    // console.log(params + 'this is params');
    let result = await db.query({sql, params});
    console.log('this is regist result');
    console.log(result);
    if(result.state) {
        res.send({result : "OK"});
    }else {
        res.send({result : "FALE"});
    }
});
// 레스토랑 메뉴 등록
router.post('/menu_registe' , upload.single('files'), async (req, res) => {
    var menu = JSON.parse(req.body.menu)
    console.log(req.file)

    console.log(menu)
    let { menu_name, price, contents } = menu;
    let image_path = req.file.filename
    let sql = `
            INSERT INTO
                menu(menu_name, price, contents,image)
            VALUES (?,?,?,?)
    `

    let params = [menu_name, price, contents, image_path];
    let result = await db.query({ sql, params });
    console.log(result);
    if (result.state) {
        res.send({ result: "OK" });
    } else { 
        res.send({ result: "FALE" });
    }
})


// 게시물 수정
router.put('/revise', async (req, res) => {
    const { updateData } = req.body;
    const { idx, title, contents, author } = updateData;
    
    let sql = `
        UPDATE 
            allboard 
        SET 
            title = ?,
            contents = ?,
            author = ?
        WHERE 
            idx = ?
    `

    let params = [title, contents, author, idx];
    let result = await db.query({ sql, params });
    if (!result) { 
        res.status(400).send({
            status: false,
            message: 'FAIL TO UPDATE ITEM'
        });

        return;
    }

    res.send({
        data: result
    });
})


module.exports = router