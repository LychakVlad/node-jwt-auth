require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
