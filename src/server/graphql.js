const { ApolloServer, gql } = require("apollo-server-express");
const MongoClient = require("mongodb").MongoClient;
const express = require("express");

const uri =
  "mongodb+srv://JaniS:10sm8jms@tapahtumaapuri.razer.mongodb.net/TapahtumaApuri?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(function (err) {
  console.log("MongoDB connected!");
  db = client.db("TapahtumaApuri");
  // perform actions on the collection object
});

const typeDefs = gql`
  type Query {
    info: [Info]
    infoid(YhteenvetoID: String!): [Info]
    jatkokysymys: [Kysymys]
    jatkokysymyslastid: [Kysymys]
    jatkokysymysid(JatkokysymysID: String!): [Kysymys]
    kysymys: [Kysymys]
    kysymyslastid: [Kysymys]
    kysymysid(KysymysID: String!): [Kysymys]
    vastaus: [Vastaus]
    vastauslastid: [Vastaus]
    vastausid(KysymysID: String!): [Vastaus]
    yhteenveto: [Yhteenveto]
    yhteenvetoid(VastausID: String!): [Yhteenveto]
    yhteenvetostack(YhteenvetoID: String!): [Yhteenvetostack]
    kysymysIdEiJatko(KysymysID: String!): [Kysymys]
  }

  type Mutation {
    luokysymys(KysymysID: String!, KysymysTXT: String!, KysymysINFO: String): Kysymys
  }

  type Info {
    YhteenvetoID: String!
    Otsikko: String!
    InfoTXT: String!
    Linkki: String!
  }

  type Kysymys {
    KysymysID: String!
    JatkokysymysID: String
    KysymysTXT: String!
    KysymysINFO: String!
  }

  type Vastaus {
    VastausID: String
    VastausTXT: String
    KysymysID: String
    JatkokysymysID: String
  }
  type Yhteenveto {
    YhteenvetoID: String!
    VastausID: String!
  }
  type Yhteenvetostack {
    YhteenvetoID: String!
    Otsikko: String!
    Linkki: String!
    InfoTXT: String!
  }
`;

const arrayQuery = async (collectionName) => {
  data = await db
    .collection(collectionName)
    .find()
    .toArray()
    .then((res) => {
      return res;
    });
  return data;
};
const idQuery = async (collectionName, args, idName) => {
  if (args[idName]) {
    var id = args[idName];
    data = await db
      .collection(collectionName)
      .find()
      .toArray()
      .then((res) => {
        return res.filter((field) => field[idName] === id);
      });
    return data;
  } else {
    data = await db
      .collection(collectionName)
      .find()
      .toArray()
      .then((res) => {
        return res;
      });
    return data;
  }
};

const resolvers = {
  Mutation: {
    luokysymys: async (parent, args) => {
      const kysymysObj = {
        KysymysID: args.KysymysID,
        KysymysTXT: args.KysymysTXT,
        KysymysINFO: args.KysymysINFO
      }
      const collectionName = 'Kysymys';
      let res = await db.collection(collectionName).insertOne(kysymysObj)
      console.log(res)
      return kysymysObj
    }
  },
  Query: {
    info: async () => {
      return arrayQuery("Info");
    },

    infoid: async (parent, args, context, info) => {
      return idQuery("Info", args, "YhteenvetoID");
    },

    jatkokysymys: async () => {
      return arrayQuery("Kysymys");
    },

    jatkokysymyslastid: async () => {
      let jatkokysymykset = await arrayQuery("Kysymys");

      let viimJKys = jatkokysymykset[jatkokysymykset.length -1]
      return [viimJKys]
    },

    jatkokysymysid: async (parent, args, context, info) => {
      return idQuery("Kysymys", args, "JatkokysymysID");
    },

    kysymys: async () => {
      return arrayQuery("Kysymys");
    },

    kysymyslastid: async () => {
      let kysymykset = await arrayQuery("Kysymys");

      let viimKys = kysymykset[kysymykset.length -1]
      return [viimKys]
    },

    kysymysid: async (parent, args, context, info) => {
      return idQuery("Kysymys", args, "KysymysID");
    },

    vastaus: async () => {
      return arrayQuery("Vastaukset");
    },

    vastauslastid: async () => {
      let vastaukset = await arrayQuery("Vastaukset");

      let viimVas = vastaukset[vastaukset.length -1]
      return [viimVas]
    },

    vastausid: async (parent, args, context, info) => {
      return idQuery("Vastaukset", args, "KysymysID");
    },

    yhteenveto: async () => {
      return arrayQuery("Yhteenveto");
    },

    yhteenvetoid: async (parent, args, context, info) => {
      return idQuery("Yhteenveto", args, "VastausID");
    },

    yhteenvetostack: async (parent, args, context) => {
      let info = await idQuery("Info", args, "YhteenvetoID");

      const data = {
        Otsikko: info[0].Otsikko,
        InfoTXT: info[0].InfoTXT,
        Linkki: info[0].Linkki,
      };
      return [data];
    },
    kysymysIdEiJatko: async (parent, args, context) => {
      // Palauttaa haun, jolla on annettu KysymysID ja lisäksi
      // JatkokysymysID on tyhjä tai null.
      const collectionName = 'Kysymys';
      if (args.KysymysID) {
        var id = args.KysymysID;
        let data = await db.collection(collectionName)
          .find()
          .toArray()
          .then(res => {
              return res.filter(field => {
                  return field.KysymysID === id && !field.JatkokysymysID;
              })
          });
        return data 
      } else {
        let data = await db.collection(collectionName).find().toArray().then(res => {return res})
        return data
      }
    }

  },
  
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
const path = "/api/graphql";

server.applyMiddleware({ app, path });
app.listen({ port: 3001 }, () =>
  console.log(`Server ready at http://localhost:3001${server.graphqlPath}`)
);
