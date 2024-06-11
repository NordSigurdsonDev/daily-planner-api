const express = require('express');
const mongoose = require('mongoose');
const MONGODB_URL = 'mongodb://127.0.0.1:27017/daily-planner-api';

const { PORT = 3000 } = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.listen(PORT);
