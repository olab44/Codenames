const mysql = require('mysql2');


function connect() {
  const db = mysql.createConnection({
    host: '0.0.0.0',
    user: 'z13',
    password: 'Napoleon.1804',
    database: 'words'
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
  const sqlRoles = 'SELECT * FROM roles';

  return Promise.all([
    db.promise().query(sqlCodenames).then(([rows, fields]) => rows),
    db.promise().query(sqlRoles).then(([rows, fields]) => rows)
  ])
    .then(([codenamesData, rolesData]) => {
      return { codenamesData, rolesData };
    })
    .catch((error) => {
      console.error('Error fetching data from MySQL:', error);
      throw error;
    });
}



module.exports = { getAllData };

// getAllData()
//   .then(({ codenamesData, rolesData }) => {
//     console.log('Words for game:', codenamesData.map(word => word.word_text));
//     // console.log('Role Names:', rolesData.map(role => role.role_name));
//     // console.log('Possible roles', rolesData);

//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   })
//   .finally(() => {
//     process.exit();
//   });

