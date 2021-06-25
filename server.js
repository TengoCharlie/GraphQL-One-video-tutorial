const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const Schema = require("./schema");

// Config
const APP_PORT = 3000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true,
  })
);

app.listen(APP_PORT, () => {
  console.log(`App listening on the port ${APP_PORT}`);
});
