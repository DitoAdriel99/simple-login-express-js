let mysql = require('mysql');
 
let connection = mysql.createConnection({
   host:        'localhost',
   port:        3307,
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