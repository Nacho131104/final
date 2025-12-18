export const COLLECTION_TRAINERS = "Trainers"
export const COLLECTION_POKEMONS = "Pokemons"

export const COLLECTION_OWNEDS = "OwnedsPokemons"

export const numeroAleatorio = () =>{
    const max = 100
    const min = 1
    return Math.floor((Math.random() * (max - min + 1)) + min)
}