var mysql = require('mysql2/promise');
// Connection 객체 생성 
const pool = mysql.createPool({
  host: '127.0.0.1', //내 로컬
  port: 3306,
 	user: 'root',
 	password: 'root',
  database: 'board',
  // database: 'test',
  waitForConnections: true ,
  connectionLimit: 15,
  queueLimit: 0,
  dateStrings: [
      'DATE',
      'DATETIME'
  ]
});

module.exports = {
    
  //일반 쿼리문
  query : async function({sql, params}){
    let result = {};
    
    try{
        const connection = await pool.getConnection(async conn => conn)
        
        try {          
          const [rows] = await connection.query(sql, params); // sql 쿼리문 실행
          result.rows = rows;
          result.state = true;
          connection.release(); // 사용된 풀 반환
          return result;       
          
        } catch (err) {
          console.log(err);
          result.state = false;
          result.error = err;
          connection.release();
          return result;
            
        }      
    }catch (err) {
      
      console.log('DB Error');
      result.state = false;
      result.error = err;
      return result;
        
    }
  },
  getConn : async function(){
    let connection = null
    try{
      connection = await pool.getConnection(async conn => conn)
      await connection.query('START TRANSACTION');

    }catch(e){console.log(e)}
    return connection
  },
  commitConn: async function({conn}){
    try{
      await conn.query('COMMIT');
      //Release Connection
      await conn.release();
    }catch(e){
      console.log(e)
      await conn.query('ROLLBACK');
      await conn.release();
    }    
  },
  rollbackConn: async function({conn}){
    await conn.query('ROLLBACK');
    await conn.release();
  },
  singleQuery : async function({conn, sqlAndParam}){
    let result = {};
    try{
      //Excute Query for Each SQL AND PARAMS
      const [rows] = await conn.query(sqlAndParam.sql, sqlAndParam.params);        
      //Adding Result to Final Result
      result.rows = rows;
      result.state = true;
      return result;
      
    }catch(err){
      result.state = false;
      result.error = err;
      
      return result;
    }
  },
  manyQuery: async function({conn, sqlAndParams}){
    let resultExcute = [];
    let result = {};
    try{
      //Excute Query for Each SQL AND PARAMS
      for(var i = 0; i < sqlAndParams.length; i ++){
        const [rows] = await conn.query(sqlAndParams[i].sql, sqlAndParams[i].params);  
        console.log(rows)
        resultExcute.push({row: rows, state : true})
      }
      
      //Adding Result to Final Result
      result.rows = resultExcute;
      result.state = true;
      
      return result;
      
    }catch(err){
      result.state = false;
      result.error = err;
      
      return result;
    }
  },
  //transaction 쿼리문
  //sqlAndParams : [{sql, params}]
  //([{sql:sel.....,params: [a,b,c....]}])
  transactionQuery : async function({sqlAndParams}){
    console.log(sqlAndParams)
      //final Result
      let result = {};
      try{
        //create connection 
        const connection = await pool.getConnection(async conn => conn)
        //Each Query Result Container
        let resultExcute = [];
        try{
          //Start Transaction
          await connection.query('START TRANSACTION');
          //Excute Query for Each SQL AND PARAMS
          for(var i = 0; i < sqlAndParams.length; i ++){
            const [rows] = await connection.query(sqlAndParams[i].sql, sqlAndParams[i].params);  
            resultExcute.push({row: rows, state : true})
          }
          //Adding Result to Final Result
          result.rows = resultExcute;
          result.state = true;
          //COMMIT Transaction
          await connection.query('COMMIT');
          //Release Connection
          await connection.release();
          
          return result;
          
        }catch(err){
          console.log(err)
          console.log('query Error');
          await connection.query('ROLLBACK');
          connection.release();
          result.state = false;
          result.error = err;
          
          return result;
        }
        
        
      }catch(err){
        console.log(err)
        console.log('DB Error');
        result.state = false;
        result.error = err;
        return result;
      }
  }
  
}
