require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const connectDB = require('./configs/db.config');
const { router } = require('./routes');
const { convertSnakeToCamelMiddleware } = require('./middlewares/convert-snack-to-camel.middleware');
const path = require("node:path");

const app = express();

const allowedOrigins = [
    "http://localhost:5000",
    "http://localhost:3000",
    "https://your-frontend-domain.com"
];

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin))
            callback(null, true);
        else
            callback(new Error("Not allowed by CORS"));

    },
    credentials: true
};


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, "../", "uploads")));
app.use(convertSnakeToCamelMiddleware);

connectDB();

router(app)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});