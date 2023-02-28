// models/client.model.js
const { Schema, model } = require('mongoose');

const clientSchema = new Schema(
  {
    clientname: {
      type: String,
      trim: true,
      required: [true, 'clientname is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    image:{
      type:String
    },
    fullName:{
      type:String
    },
    dateOfBirth:{
      type:Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Client', clientSchema);