const express = require('express')
const cors = require('cors')
const pokedex = require('./pokedex.json')
const { validatePokemon, validatePartialPokemon } = require('./Schemas/pokemon')

const PORT = process.env.PORT ?? 1234

const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [ 
            'http://localhost:8080',
            'http://localhost:1234',
            'https://pokedex.com',
            'https://crisLGC.dev'
        ]
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        return callback(null, true)
    }

    return callback(new Error('Origin not allowed'))
}}))

app.get('/pokedex', (req, res) => {
    const { type } = req.query
    if (type) {
        const filteredType = pokedex.filter(
            pokemon => pokemon.type.toLowerCase() === type.toLowerCase()
        )
        return res.json(filteredType)
    }
    return res.json(pokedex)
})

app.get('/pokedex/:id', (req, res) => {
    const { id } = req.params
    const pokemon = pokedex.find(pokemon => pokemon.id === Number(id))
    if (pokemon){
        res.json(pokemon)
    }
    return res.status(404).json({message: "Not found"})
    
})


app.post('/pokedex', (req, res) => {
    const result = validatePokemon(req.body)
    if (!result.success) {
        return res.status(400).json({ message: JSON.parse(result.error.message) })
    }
    const newPokemon = {
        ...result.data
    }
    pokedex.push(newPokemon)

    res.status(201).json(newPokemon)

})

app.patch('/pokedex/:id', (req, res) => {
    const result = validatePartialPokemon(req.body)
    if (!result.success) {
        return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const pokemonIndex = pokedex.findIndex(pokemon => pokemon.id === Number(id))

    if (pokemonIndex === -1) {
        return res.status(404).json({ message: 'Pokemon not found' })
    }

   

    const updatedPokemon = {
        ...pokedex[pokemonIndex],
        ...result.data
    }

    pokedex[pokemonIndex] = updatedPokemon

    res.json(updatedPokemon)

})

app.delete('/pokedex/:id', (req, res) => {
    const { id } = req.params
    const pokemonIndex = pokedex.findIndex(pokemon => pokemon.id === Number(id))

    if (pokemonIndex === -1) {
        return res.status(404).json({ message: 'Pokemon not found' })
    }

    pokedex.splice(pokemonIndex, 1)
    return res.json({ message: 'Pokemon deleted successfully' })
})















app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})