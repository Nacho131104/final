import { ObjectId } from "mongodb";



export enum PokemonType {
    NORMAL,
    FIRE,
    WATER,
    ELECTRIC,
    GRASS,
    ICE,
    FIGHTING,
    POISON,
    GROUND,
    FLYING,
    PSYCHIC,
    BUG,
    ROCK,
    GHOST,
    DRAGON
}
export type Pokemon ={
    _id?: ObjectId,
    name: string,
    description: string,
    height: number,
    weight: number,
    types: string[]
}


export type Trainer ={
    _id: ObjectId,
    name:string,
    pokemons: string[]
}

export type OwnedPokemon ={
    _id: ObjectId,
    pokemon: string
    nickname: string
    attack: number
    defense: number
    speed: number
    special: number
    level: number
}


export type TokenPayload = {
    userId: string;
}
