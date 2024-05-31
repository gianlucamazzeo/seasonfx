const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const {readdirSync} = require("fs");
require("dotenv").config();


// import routes
const authRoutes = require("./routes/auth");

// app
const app = express();


// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB CONNECTED!" + process.env.DATABASE))
  .catch((err) => console.log(`DB CONNECTION ERR ${err}`));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

app.use(cors({
  origin: 'https://seasonfx.vercel.app/', // Sostituisci con l'URL del tuo frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
}));



// routes middleware
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

// port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(` Server is running on port ${port}`));
