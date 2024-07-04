const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Book = require('./models/Book');
const Purchase = require('./models/Purchase'); // Import the Purchase model
const Enquiry = require('./models/Enquiry');
const Feedback = require('./models/Feedback');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb+srv://shrusonawane7:1234@cluster0.wvl2naz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { fullname, mobile, email, username, password, confirmpassword } = req.body;

  // Check if password and confirm password match
  if (password !== confirmpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Determine role based on email domain
  const role = email.endsWith('numetry.com') ? 'admin' : 'user';

  try {
    const newUser = new User({ fullname, mobile, email, username, password, confirmpassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Store login time and date
    user.loginTimes.push(new Date());
    await user.save();

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Logout Endpoint
app.post('/logout', async (req, res) => {
  const { username, logoutTime } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the logoutTimes array
    user.logoutTimes.push(new Date(logoutTime));
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
});

// Fetch Users Endpoint
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

app.get('/userss', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['user', 'admin'] } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});


// Add a new book
app.post('/submit', async (req, res) => {
  try {
    const {
      publishername,
      categories,
      bookname,
      author,
      imageurl,
      description,
      publisherdate,
      price,
      totalcopies,
      newarrival,
      availablecopies
    } = req.body;

    const book = new Book({
      publishername,
      categories,
      authors: {
        bookname,
        author,
        imageurl,
        description,
        publisherdate,
        price,
        totalcopies,
        newarrival,
        availablecopies
      }
    });

    await book.save();
    res.status(201).send('Book details saved successfully!');
  } catch (error) {
    res.status(400).send('Error saving book details: ' + error.message);
  }
});

// Fetch all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books data', error: error.message });
  }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Server error');
  }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      publishername,
      categories,
      bookname,
      author,
      imageurl,
      description,
      publisherdate,
      price,
      totalcopies,
      newarrival,
      availablecopies
    } = req.body;

    // Ensure the book exists before attempting an update
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    book.publishername = publishername;
    book.categories = categories;
    book.authors.bookname = bookname;
    book.authors.author = author;
    book.authors.imageurl = imageurl;
    book.authors.description = description;
    book.authors.publisherdate = publisherdate;
    book.authors.price = price;
    book.authors.totalcopies = totalcopies;
    book.authors.newarrival = newarrival;
    book.authors.availablecopies = availablecopies;

    await book.save();

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Purchase Endpoint
app.post('/purchase', async (req, res) => {
  const { username, book, address, numCopies, totalPrice } = req.body;

  try {
    const newPurchase = new Purchase({
      username,
      book,
      address,
      numCopies,
      totalPrice,
    });

    await newPurchase.save();
    res.status(201).json({ message: 'Purchase successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Define a route to fetch all purchases
app.get('/purchases', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new enquiry
app.post('/enquiry', async (req, res) => {
  const { name, email, mobile, query } = req.body;

  try {
    const enquiry = new Enquiry({ name, email, mobile, query });
    await enquiry.save();
    res.status(201).json({ message: 'Enquiry saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save enquiry' });
  }
});

app.get('/enquires', async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feedback Endpoint
app.post('/feedback', async (req, res) => {
  const { name, email, mobileNo, message } = req.body;

  try {
    const newFeedback = new Feedback({ name, email, mobileNo, message });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
