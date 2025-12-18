import { COLLECTION_POKEMONS } from "../utils";
import { Pokemon, PokemonType } from "../types";
import { getDb } from "../mongo/conexion";


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