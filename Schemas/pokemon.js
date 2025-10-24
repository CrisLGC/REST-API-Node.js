const z = require('zod');

const pokemonSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    type: z.string().min(1),
    description: z.string().min(1),
    image: z.string().url({
        message: "Image must be a valid URL"
    })
})

function validatePokemon(object) {
    return pokemonSchema.safeParse(object);
}

function validatePartialPokemon(object) {
    return pokemonSchema.partial().safeParse(object);
}

module.exports = {
    validatePokemon,
    validatePartialPokemon
};