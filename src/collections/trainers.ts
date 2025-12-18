import { getDb } from "../mongo/conexion";
import { COLLECTION_TRAINERS } from "../utils";
import bcrypt from "bcryptjs";

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

