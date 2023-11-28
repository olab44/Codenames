const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Napoleon.1804',
  database: 'words'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = db;


function getAllData() {
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
//     // console.log('Words for game: ', codenamesData);
//     console.log('Words for game:', codenamesData.map(word => word.word_text));
//     const roleNames = rolesData.map(role => role.role_name);
//     // console.log('Role Names:', rolesData.map(role => role.role_name));
//     console.log('Possible roles', rolesData);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   })
//   .finally(() => {
//     process.exit();
//   });

