import { ObjectId } from "mongodb";
import { getDb } from "../mongo/conexion";
import { COLLECTION_TRAINERS } from "../utils";
import bcrypt from "bcryptjs";
import { Trainer } from "../types";
import { get } from "axios";

export const registerTrainer = async(name: string,password: string)=>{

    const db=getDb()
    const encriptada = await bcrypt.hash(password,10)


    const existente = await db.collection(COLLECTION_TRAINERS).findOne({name})
    if(existente)throw new Error("Ese trainer ya existe")
    const result = await db.collection(COLLECTION_TRAINERS).insertOne({
        name,
        password:encriptada,
        pokemons: []
    })

    return result.insertedId.toString()

}

export const comprobarContraseña =async (name:string,password:string)=>{
    const db=getDb()
    const usuario =await db.collection(COLLECTION_TRAINERS).findOne({name})
    if(!usuario){
        return null
    }

    const comparar = await bcrypt.compare(password,usuario.password)

    if(!comparar){
        return null
    }

    return usuario
}


//funcion para comprobar el tamaño de los capturados
export const comprobarPokemonsCapturados = async (idTrainer: string) =>{
    const db = getDb()

    const trainer = await db.collection<Trainer>(COLLECTION_TRAINERS).findOne({_id: new ObjectId(idTrainer)})
    if(!trainer) throw new Error("Este entrenador es inexistente")
    const capturados = trainer.pokemons
    if(capturados.length >=6) return false
    return true

}


export const getPokemonsCap = async(trainerId: string)=>{
    const db = getDb()

    const trainer = await db.collection<Trainer>(COLLECTION_TRAINERS).findOne({_id: new ObjectId(trainerId)})
    const poks = trainer?.pokemons
    return poks
}