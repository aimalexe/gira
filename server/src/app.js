require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./configs/db.config');
const { router } = require('./routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
connectDB();

router(app)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});