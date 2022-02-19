const db = require('../db');


module.exports = {
    loginProcess (req,res){
        console.log(req.body);
        var {id,pw} = req.body;
        if(id == '123' && pw == '1234') {
            res.send({result : "OK"});
        }else {
            res.send({result : "FAIL"})
        }
    },
    async allBoard (req,res){
        let sql = `
                SELECT
                    idx, title, contents, author, regdate
                FROM
                    allboard
                `
        let result = await db.query({sql});
        // 내가 디비에서 받을 정보가 어디에 담겨있는지 확인 필요(ex: rows)
        // console.log(result);
        if(result.rows.length > 0) {
            res.send({result : "OK", data: result.rows});
        }else {
            res.send({result: "FAIL"});
        }
    }

}