const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  book: {
    bookname: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageurl: {
      type: String,
    },
  },
  address: {
    type: String,
    required: true,
  },
  numCopies: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Purchase', purchaseSchema);
