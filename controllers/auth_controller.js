const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_secrete =  process.env.SECRET_KEY || 'mysecret';
exports.register = (req, res) => {
  try {
    const user = new User(req.body);
    const saltRounds = 10;
    const hashed = bcrypt.hashSync(user.password, saltRounds);
    user.password = hashed;
    console.log(user);
    user.save();
    res.send({ message: 'User created successfully' });
  } catch {
    return res.status(400).send({ message: 'Failed to Create User' });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ _id: user._id },jwt_secrete, {
      expiresIn: '1h',
    });
    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error logging in' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find().exec();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Users' });
  }
};
