import dotenv from "dotenv"
import { ApolloServer } from "apollo-server";
import { connectmongodb } from "./mongo/conexion"
import {typeDefs} from "./graphql/schema"
import {resolvers} from "./graphql/resolvers"
dotenv.config()


const app = async () => {
  await connectmongodb();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.listen({ port: 5000 });
  console.log("Inciado server sql");
};

app().catch(err=>console.error(err));


