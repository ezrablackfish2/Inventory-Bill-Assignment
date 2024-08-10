const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_secrete =  process.env.SECRET_KEY || 'mysecret';


exports.getUser = async (req, res) => {
  try {
    const user = await User.find().exec();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Users' });
  }
};



// Create User
exports.createUser = async (req, res) => {
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

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching User' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating User' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id).exec();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting User' });
  }
};
