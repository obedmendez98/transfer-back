const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Account = require('../models/accountModel');

router.post('/login', async (req, res) => {
  const { body } = req;
  const { username, password } = body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.id }, 'secret_key', { expiresIn: '1h' });

    const accounts = await Account.find({ user_id: 'sxsx'});
    console.log(accounts);

    let information_user = {
      accounts: accounts
    }

    return res.status(200).json({ token, information_user });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
