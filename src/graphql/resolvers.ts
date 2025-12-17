import { IResolvers } from "@graphql-tools/utils";




export const resolvers: IResolvers = {
    Query:{
        me:()=>"Hola mundo"
    }
}