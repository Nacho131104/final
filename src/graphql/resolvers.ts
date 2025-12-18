import { IResolvers } from "@graphql-tools/utils";
import { comprobarContraseña, comprobarPokemonsCapturados, registerTrainer } from "../collections/trainers";
import { signToken } from "../auth";
import { crearPokemon, getPokemonById, getPokemons } from "../collections/pokemons";
import { COLLECTION_POKEMONS, COLLECTION_TRAINERS, numeroAleatorio } from "../utils";
import { OwnedPokemon, Trainer } from "../types";
import {COLLECTION_OWNEDS} from "../utils"
import { getDb } from "../mongo/conexion";
import { ObjectId } from "mongodb";

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
            return await crearPokemon(name,description,height,weight,types)
        },
        catchPokemon:async(_,{pokemonId,nickname},{trainer})=>{
            if(!trainer)throw new Error("Debes estar logeado antes")

            const db = getDb()

            const pokemon = await getPokemonById(pokemonId)
            if(!pokemon) throw new Error("El pokemon que intentas coger no existe")

            const attack = numeroAleatorio()
            console.log(attack)
            const defense = numeroAleatorio()
            console.log(defense)
            const speed = numeroAleatorio()
            const special = numeroAleatorio()
            const level =1
            const capturado:OwnedPokemon = {
                _id: new ObjectId,
                pokemon: pokemonId,
                nickname,
                attack,
                defense,
                speed,
                special,
                level
            }
            const tamanio = await comprobarPokemonsCapturados(trainer._id.toString())
            if(!tamanio) throw new Error("Tamaño de pokemons capturados lleno")

            //modificamos el array de ids de pokemons del entrenador

            const modificado = await db.collection(COLLECTION_TRAINERS).updateOne(
                {_id: trainer._id},
                {$addToSet: {pokemons: capturado._id.toString()}}
            )
            if(!modificado)throw new Error("Error al insertar el id del pokemon añadido en el trainer")

            //insertamos el pokemon insertado en la collection    
            const insertado = await db.collection(COLLECTION_OWNEDS).insertOne(capturado)

            if(!capturado) throw new Error("Error al capturar el pokemon")
            return capturado
        },
        freePokemon:async(_,{ownedPokemonId},{trainer})=>{
            if(!trainer)throw new Error("Debes de logearte primero")
        }

    },
    Query: {
        me: async(_, __, {trainer})=>{
            if(!trainer)return null
            return trainer
        },
        pokemons:async(_,{page,size})=>{
            return await getPokemons(page,size)
        },
        pokemon: async(_,{id})=>{
            return await getPokemonById(id)
        }
    },

    Trainer: {
        pokemons: async(parent: Trainer) =>{
            const db = getDb()
            const ids = (parent.pokemons || []).map((id) => new ObjectId(id))
            const pokemons = await db.collection(COLLECTION_OWNEDS).find({_id:{$in:ids}}).toArray()
            return pokemons
        }
    },
    OwnedPokemon:{
        pokemon: async (parent: OwnedPokemon) =>{
            const db = getDb()
            const id =  new ObjectId(parent.pokemon)

            const pokemon = await db.collection(COLLECTION_POKEMONS).findOne({_id:id})
            return pokemon
        }
    }
}