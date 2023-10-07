const express = require('express')
const bodyParser = require('body-parser');
const connection = require('./config/database');
const app = express()
const port = 3000
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4(); 
const { fromUnixTime } = require('date-fns');
const timestamp = new Date().getTime();
const createdAt = fromUnixTime(timestamp / 1000);
const updatedAt = fromUnixTime(timestamp / 1000);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { body, validationResult } = require('express-validator');

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/register', [
  body('name').notEmpty().isLength({ min: 3, max: 50 }),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isLength({ min: 3, max: 50 })
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  connection.query('SELECT * FROM users WHERE email = ?', req.body.email, (err, rows) => {
    if (err) {
      console.log('Error', err);
      return res.status(500).json({
        status: false,
        message: err.sqlMessage
      });
    }

    if (rows.length > 0) {
      return res.status(409).json({
        status: false,
        message: 'Email already exists'
      });
    }

    const formData = {
      id: uuid,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      created_at: createdAt,
      updated_at: updatedAt
    };

    connection.query('INSERT INTO users SET ?', formData, (err, rows) => {
      if (err) {
        console.log('Error', err);
        return res.status(500).json({
          status: false,
          message: err.sqlMessage
        });
      } else {
        return res.status(201).json({
          status: true,
          message: 'Success Register User!',
          data: rows[0]
        });
      }
    });
  });
});

app.post('/api/login', [
  body('email').notEmpty().isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const { email, password } = req.body;

  try {
    connection.query('SELECT * FROM users WHERE email = ?', email, (err, rows) => {
      if (err) {
        console.log('Error', err);
        return res.status(500).json({
          status: false,
          message: err.sqlMessage
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Email not found'
        });
      }

      const hashedPassword = rows[0].password;
      bcrypt.compare(password, hashedPassword, (err, passwordMatch) => {
        if (err) {
          console.log('Error', err);
          return res.status(500).json({
            status: false,
            message: 'Error comparing passwords'
          });
        }

        if (!passwordMatch) {
          return res.status(422).json({
            status: false,
            message: 'Password does not match'
          });
        }

        const userData = {
          id: uuid,
          name: rows[0].name,
          email: req.body.email,
          created_at: createdAt,
          updated_at: updatedAt
        };

        userData.token = generateJwtToken(userData);

        return res.status(200).json({
          status: true,
          message: 'Login Successfully',
          data: userData
        });
      });
    });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({
      status: false,
      message: error.message || 'An error occurred'
    });
  }
});

app.get('/api/me', (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Token not provided',
    });
  }

  const userData = decodeJwtToken(token);
  if (userData instanceof Error) {
    return res.status(401).json({
      status: false,
      message: 'Invalid token',
    });
  }

  return res.status(200).json({
    status: true,
    message: 'My Info',
    data: userData,
  });
});
  
function generateJwtToken(payload) {
  const secretKey = 'dito1234567890';
  const options = { expiresIn: '1h' }; 

  const token = jwt.sign(payload, secretKey, options);
  return token;
}

function decodeJwtToken(bearer){
  const secretKey = 'dito1234567890';
  try {
  const token = bearer.split(' ')[1];
  const decodedToken = jwt.verify(token, secretKey);
    return decodedToken
  } catch (error) {
    return error
  }
}

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
}) 