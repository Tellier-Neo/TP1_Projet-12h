// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ejs = require('ejs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');


// Create an Express app
const app = express();
app.use(express.json());

// Set up middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up database connection
const db = {
  host: 'localhost',
  user: 'Lawrence_control',
  password: '159874236951',
  database: 'Lawrence',
  port: 3306,
};

// Create a connection to the database
const mysql = require('mysql');
const connection = mysql.createConnection(db);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log("Connectée en tant qu'id de thread numéro : " + connection.threadId);
});

// Register route
app.post('/register', (req, res) => {
  try {
    const { user, email, password } = req.body;

    if (!user || !email || !password) {
      return res.status(400).send({ message: 'User, email, and password are required', errorCode: 'REGISTER_MISSING_FIELDS' });
    }

    const emailQuery = 'SELECT * FROM User WHERE email = ?';
    connection.query(emailQuery, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error checking email', errorCode: 'REGISTER_EMAIL_CHECK_FAILED' });
      }

      if (results.length > 0) {
        return res.status(400).send({ message: 'Email is already in use', errorCode: 'REGISTER_EMAIL_IN_USE' });
      }

      const userQuery = 'SELECT * FROM User WHERE user = ?';
      connection.query(userQuery, [user], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: 'Error checking username', errorCode: 'REGISTER_USERNAME_CHECK_FAILED' });
        }

        if (results.length > 0) {
          return res.status(400).send({ message: 'Username is already taken', errorCode: 'REGISTER_USERNAME_TAKEN' });
        }

        const hashedPassword = hashPassword(password);
        const token = randomToken();
        console.log(`Generated token: ${token}`);

        const insertQuery = 'INSERT INTO User (user, email, password, token, isAdmin) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertQuery, [user, email, hashedPassword, token, 0], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error registering user', errorCode: 'REGISTER_FAILED' });
          }

          console.log(`User ${user} registered successfully with token ${token}`);
          res.send({ message: 'User registered successfully', token });
        });
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send({ message: 'Internal server error', errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// Login route (simplified as per your requirements)
app.post('/login', async (req, res) => {
  console.log("Request called");
  const { user, email, password } = req.body;

  if ((!user && !email) || !password) {
    return res.status(400).json({ error: 'Username or email and password are required' });
  }

  try {
    let query = 'SELECT * FROM User WHERE ';
    let params;

    if (user) {
      query += 'user = ?';
      params = [user];
    } else {
      query += 'email = ?';
      params = [email];
    }

    connection.query(query, params, async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      const user = result[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      res.json({ uniqueToken: user.token });
    });
  } catch (error) {
    console.error('Internal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send({ message: 'Internal server error', errorCode: 'INTERNAL_SERVER_ERROR' });
});


// Function to hash the password using bcrypt
function hashPassword(password) {
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

function randomToken() {
  // Obtenir la date et l'heure actuelle pour ajouter de l'entropie
  const now = new Date();
  const timestamp = now.getTime();

  // Fonction pour générer une chaîne de caractères aléatoire
  function randomString(length, chars) {
    let result = '';
    const charactersLength = chars.length;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Générer une liste de mots aléatoires
  function generateRandomWordList(numWords, minLength, maxLength) {
    const words = [];
    for (let i = 0; i < numWords; i++) {
      const wordLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      words.push(randomString(wordLength, 'abcdefghijklmnopqrstuvwxyz'));
    }
    return words;
  }

  // Créer un ensemble de caractères pour la génération
  const allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';

  // Générer une liste de mots aléatoires
  const randomWordList = generateRandomWordList(5, 4, 8); // 5 mots de longueur entre 4 et 8 caractères
  const randomWord = randomWordList[Math.floor(Math.random() * randomWordList.length)];

  // Choisir une lettre aléatoire du mot
  const randomLetter = randomWord[Math.floor(Math.random() * randomWord.length)];

  // Obtenir la position de la lettre dans l'alphabet (1-26)
  const letterToPosition = (letter) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return alphabet.indexOf(letter.toLowerCase()) + 1;
  };

  // Obtenir la position de la lettre dans l'alphabet
  const position = letterToPosition(randomLetter);

  // Générer des nombres aléatoires et les convertir en chaîne
  const randomNumbers = Array.from({ length: position }, () => Math.floor(Math.random() * 256)).join('-');

  // Ajouter des éléments basés sur le timestamp pour plus d'entropie
  const timestampPart = randomString(8, allChars) + '-' + timestamp.toString(36);

  // Générer une chaîne aléatoire pour compléter le token
  const additionalString = randomString(20, allChars); // Longueur de chaîne supplémentaire ajustée

  // Combiner les parties pour créer le token
  const token = `${randomWord}-${randomLetter}-${randomNumbers}-${timestampPart}-${additionalString}`;

  return token;
}

// Exemple d'utilisation
console.log(randomToken());



// Log messages for debugging purposes
console.log('Register route initialized');
console.log('Login route initialized')

// Start the server
const port = 5560;
app.listen(port, () => {
  console.log(`Serveur lancée sur le port : ${port}`);
});

