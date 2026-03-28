require("dotenv/config");

const cors = require("cors");
const path = require("node:path");
const express = require("express");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

const routes = require("./api");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "client")));

app.use("/", routes);

app.use((req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
