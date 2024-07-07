const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const MONGODB_URL = 'mongodb://127.0.0.1:27017/daily-planner-api';
const handleError = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.use(router);

app.use(handleError);

app.listen(PORT);
