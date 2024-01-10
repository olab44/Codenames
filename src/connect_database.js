const mysql = require('mysql2');


function connect() {
  const db = mysql.createConnection({
    host: '0.0.0.0',
    user: 'z13',
    password: 'Napoleon.1804',
    database: 'words',
    port: 3306
  });

  db.connect((err) => {
  if (err) console.error('Error connecting to MySQL database:', err);
  else console.log('Connected to MySQL database');
  });
  return db;
}


function getAllData() {
  const db = connect();
  const sqlCodenames = 'SELECT * FROM codenames_words';

  return Promise.all([
    db.promise().query(sqlCodenames).then(([rows, fields]) => rows),
  ])
    .then(([codenamesData]) => {
      return { codenamesData };
    })
    .catch((error) => {
      console.error('Error fetching data from MySQL:', error);
      throw error;
    });
}



module.exports = { getAllData };
