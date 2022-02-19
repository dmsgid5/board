module.exports= {
    loginConsole(req,res,next){
        console.log(req.body)
        console.log("이거는 미들웨어 1번 입니다.")
        next();
    }
}