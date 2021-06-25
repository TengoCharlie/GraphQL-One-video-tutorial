const Sequelize = require("sequelize");
const _ = require("lodash");
const Faker = require("faker");

const Conn = new Sequelize("node_sql", "postgres", "123456789", {
  dialect: "postgres",
  host: "localhost",
});

const People = Conn.define("people", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

const Post = Conn.define("post", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// RelationShips

People.hasMany(Post);
Post.belongsTo(People);

Conn.sync({ force: true }).then(() => {
  _.times(10, () => {
    return People.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
    }).then((people) => {
      return people.createPost({
        title: `Sample title by ${people.firstName}`,
        content: "THis is a sample article",
      });
    });
  });
});

module.exports = Conn;
