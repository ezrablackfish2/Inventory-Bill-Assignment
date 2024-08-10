const express = require('express');
const app = express();

const authRouter = require('./routes/auth_router');
const itemRouter = require('./routes/item_router');
const billRouter = require('./routes/bill_router');
const userRouter = require('./routes/user_router');

const authMiddleware = require('./middleware/auth_middleware');

const mongoose = require('mongoose');
const Mongo_Connection_String = process.env.Mongo_Connection_String || "your mongo db module" ;
// Connect to MongoDB
try {
  mongoose.connect(Mongo_Connection_String  );
} catch (error) {
  console.error(error);
}
// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(express.json());
app.use('/auth', authRouter);
app.use('/items', itemRouter);
app.use('/bills', billRouter);
app.use('/users',authMiddleware, userRouter);

app.listen(3000, () => {
console.log('Server started on port 3000');
});

