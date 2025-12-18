import { IResolvers } from "@graphql-tools/utils";
import { comprobarContraseña, registerTrainer } from "../collections/trainers";
import { signToken } from "../auth";




export const resolvers: IResolvers = {
    Mutation:{
        startJourney:async(_, {name,password})=>{
            const trainerid = await registerTrainer(name,password)
            return signToken(trainerid)
        },
        login: async(_,{name,password})=>{
            const user = await comprobarContraseña(name, password);
            if (!user) {
                throw new Error("Credenciales incorrectas");
            }
            return signToken(user._id.toString())
        },
        createPokemon: async(_,{name,description,height,weight,types},{trainer})=>{
            if(!trainer)throw new Error("Debes logearte primero")
        }
    },
    Query: {
        me: async(_, __, {trainer})=>{
            if(!trainer)return null
            return trainer
        }
    }
}