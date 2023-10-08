let mysql = require('mysql');
 
let connection = mysql.createConnection({
   host:        'database',
   port:        3306,
   user:        'sqluser',
   password:    'password',
   database:    'test_api'
 });

connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connection Succuessfully!');
   }
 })

module.exports = connection; 