const { admin, db } = require('../config/firebase');
const axios = require('axios');
require('dotenv').config();

const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY; 

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      role: 'customer',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered',
      data: { uid: userRecord.uid, email: userRecord.email }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`;
    
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    });

    const idToken = response.data.idToken; 

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token: idToken
    });

  } catch (error) {
    res.status(401).json({ 
        status: 'error', 
        message: 'Invalid email or password',
        detail: error.response ? error.response.data : error.message
    });
  }
};