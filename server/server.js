const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the Socio API!'});
});

mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('Database connected successfully!'))
.catch((err) => console.error('Database connection failed: ', err));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})