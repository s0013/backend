const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      // Assuming basic email format validation
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    mobileNo: {
      type: String,
      required: true,
      // Assuming basic validation for mobile number format
      match: /^[0-9]{10}$/ // Allows exactly 10 digits
    },
    message: {
      type: String,
      required: true
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
