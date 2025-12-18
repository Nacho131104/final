import { COLLECTION_POKEMONS,COLLECTION_OWNEDS } from "../utils";
import { Pokemon, PokemonType } from "../types";
import { getDb } from "../mongo/conexion";
import { ObjectId } from "mongodb";
import { types } from "util";


const comprobartipos = (type: string) =>{
    if(type in PokemonType) {
        return true
    }
    console.log(type)
    throw new Error("Tipo de pokemon no aceptado")
}

export const crearPokemon = async(name: string,description: string,height:number,weight:number,types: string[]) =>{
    const db = getDb()
    const tipos_validos = types.forEach((t)=>comprobartipos(t))
    const inserted = await db.collection<Pokemon>(COLLECTION_POKEMONS).insertOne({
        name,
        description,
        height,
        weight,
        types
    })
    return {
        _id: inserted.insertedId,
        name,
        description,
        height,
        weight,
        types
    }

}

export const getPokemonById = async(id: string) =>{
    const db = getDb()

    const pokemon = await db.collection(COLLECTION_POKEMONS).findOne({_id: new ObjectId(id)})
    return pokemon
}

export const getPokemons = async (page ?: number, size ?: number) =>{
    const db = getDb();
    page = page || 1;
    size = size || 10;
    return await db.collection(COLLECTION_POKEMONS).find().skip((page - 1) * size).limit(size).toArray();
}