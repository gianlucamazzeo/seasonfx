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

// IP statici di Render per le richieste in uscita (sostituisci con gli IP effettivi forniti da Render)
const allowedOrigins = [
  'https://seasonfx.vercel.app/', 
  '3.75.158.163',
  '3.125.183.140',
  '35.157.117.28'     // Aggiungi altri domini se necessario
];

// Configura CORS per accettare richieste solo da origini specifiche
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));



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





// routes middleware
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

// port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(` Server is running on port ${port}`));
