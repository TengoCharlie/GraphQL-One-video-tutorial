const graphql = require("graphql");
const Db = require("./db");

const People = new graphql.GraphQLObjectType({
  name: "People",
  description: "This represents a people",
  fields: () => {
    return {
      id: {
        type: graphql.GraphQLInt,
        resolve(people) {
          return people.id;
        },
      },
      firstName: {
        type: graphql.GraphQLString,
        resolve(people) {
          return people.firstName;
        },
      },
      lastName: {
        type: graphql.GraphQLString,
        resolve(people) {
          return people.lastName;
        },
      },
      email: {
        type: graphql.GraphQLString,
        resolve(people) {
          return people.email;
        },
      },
      posts: {
        type: new graphql.GraphQLList(Post),
        resolve(people) {
          return people.getPosts();
        },
      },
    };
  },
});

const Post = new graphql.GraphQLObjectType({
  name: "Post",
  description: "This is a post",
  fields: () => {
    return {
      id: {
        type: graphql.GraphQLInt,
        resolve(post) {
          return post.id;
        },
      },
      title: {
        type: graphql.GraphQLString,
        resolve(post) {
          return post.title;
        },
      },
      content: {
        type: graphql.GraphQLString,
        resolve(post) {
          return post.content;
        },
      },
      people: {
        type: People,
        resolve(post) {
          return post.getPerson();
        },
      },
    };
  },
});

const Query = new graphql.GraphQLObjectType({
  name: "Query",
  description: "This  is a root Query",
  fields: () => {
    return {
      people: {
        type: new graphql.GraphQLList(People),
        args: {
          id: { type: graphql.GraphQLInt },
          email: { type: graphql.GraphQLString },
        },
        resolve(root, args) {
          return Db.models.people.findAll({ where: args });
        },
      },
      posts: {
        type: new graphql.GraphQLList(Post),
        resolve(root, args) {
          return Db.models.post.findAll({ where: args });
        },
      },
    };
  },
});

const Mutation = new graphql.GraphQLObjectType({
  name: "Mutation",
  descrioption: "Fucntions to create stuffs",
  fields: () => {
    return {
      addPeople: {
        type: People,
        args: {
          firstName: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
          },
          lastName: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
          },
          email: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
          },
        },
        resolve(source, args) {
          return Db.models.people.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase(),
          });
        },
      },
      addPost: {
        type: Post,
        args: {
          userId: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
          },
          title: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
          },
          content: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
          },
        },
        resolve(source, args) {
          return Db.models.user.findById(args.userId).then((user) => {
            return user.createPost({
              title: args.title,
              content: args.content,
            });
          });
        },
      },
    };
  },
});

const Schema = new graphql.GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

module.exports = Schema;
