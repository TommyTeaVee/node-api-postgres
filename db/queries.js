const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',  //Database username
  host: 'localhost', 
  database: 'userman',    //Let's call the database usermanagement
  password: 'admin12345',  // Use your own password
  port: 5432, // Default port for PostgreSQL
})

//Get All users in a DATABASE
const getUsers = (req, res) =>{
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) =>{
         if (error){
           throw error
          }
        res.status(200).json(results.rows)
     }) 

}

//GET a single  User by ID
const getUserById = (req, res) => {
     const id = parseInt(req.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) =>{
         if(error) {
        throw error
        }
      res.status(200).json(results.rows)
    })
}

//POST a new user
const createUser = (req, res) => {
  const { name, email } = req.body; 
  pool.query(
  'INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id',
  [name, email],
  (error, results) => {
  if (error) {
  throw error;
  }
  res.status(201).send(`User added with ID:${results.rows[0].id} `);
  }
  );
  };

//PUT updated data in an exisiting user

const updateUser = (req, res) => {
const id = parseInt(req.params.id)
const {name, email} = req.body

pool.query(
  'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
  (error, results) => {
   if( error) {
    throw error
   }
  res.status(200).send(`User modified with ID: ${id}`)
  }
 )
}


//DELETE a user

const deleteUser = (req, res) =>{
  const id = parseInt(req.params.id)
 
 pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
   if (error){
   throw error
  }
 res.status(200).send(`Users deleted with ID: ${id}`)
})
}


//Exporting CRUD functions as modules to  REST API

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
