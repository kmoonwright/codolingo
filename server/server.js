const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("../config/keys_dev.js").MONGO_URI;

const app = express();

const models = require("./models");
const schema = require("./schema/schema");

if (!db) {
  throw new Error("You must provide a string to connect to MongoDB Atlas");
}

mongoose
  .connect(db, {
    useNewUrlParser: true, useUnifiedTopology: true 
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


app.use(express.static("server/public"))

// remember we use bodyParser to parse requests into json
app.use(bodyParser.json());

// Make sure to require your models index at the top of the file
// Don't forget to import your schema from ./schema/schema
const expressGraphQL = require("express-graphql");
// ...
const cors = require("cors");
//...
app.use(cors());


// use the expressGraphQL middleware to connect our GraphQLSchema to Express
// app.use(
//     "/graphql",
//     expressGraphQL({
//         schema,
//         graphiql: true
//     })
// );
app.use(
  "/graphql",
  expressGraphQL(req => {
    return {
      schema,
      // we are receiving the request and can check for our
      // auth token under headers
      context: {
        token: req.headers.authorization
      },
      graphiql: true
    };
  })
);


module.exports = app;