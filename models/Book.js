const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  publishername: { 
    type: String, 
    required: true 
  },
  categories: {
    type: String, 
    required: true 
  },
  authors: {
    bookname: { type: String, required: true },
    author: { type: String, required: true },
    imageurl: { type: String, required: true },
    description: { type: String, required: true },
    publisherdate: { type: Date, required: true },
    price: { type: Number, required: true },
    totalcopies: { type: Number, required: true },
    newarrival: { type: Boolean, required: true },
    availablecopies: { type: Number, required: true }
  }
});

const BookModel = mongoose.model('Book', bookSchema);
module.exports = BookModel;
