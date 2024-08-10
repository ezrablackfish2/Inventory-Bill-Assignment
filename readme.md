use npm run dev to run

use environmental to add the  Mongo_Connection_String

models 

// user collection
{
  "_id": ObjectId,
  "email": String,
  "username": String,
  "password": String
}


// items collection
{
  "_id": ObjectId,
  "name": String,
  "quantity": Number,
  "price": Number
}


// bills collection
{
  "_id": ObjectId,
  "date": Date,
  "items": [
    {
      "item": ObjectId,
      "price":Number
      "quantity": Number
    }
  ]
}


if you use postman in headers add authorization :  token provided by login
