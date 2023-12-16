// saída sera os objetos com as funções de manipulação da nossa pokeapi
// criando um objeto
const pokeApi = {}

// função para estanciar o nosso modelo de objeto com os detalhes dos pokemons
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.numero = pokeDetail.id
    pokemon.nome = pokeDetail.name
    
    const types = pokeDetail.types.map((typesSlot) => typesSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.imagem = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url) // busca o detalhe de cada pokemon
        .then((response) => response.json()) // devolve um http response e converte p json
        .then(convertPokeApiDetailToPokemon) // convertemos a lista de modelo dos pokemons para o nosso proprio modelo, que foi instanciado na função convertPokeApiDetailToPokemon
}


// criando um metodo do objeto
// offset e limit é a limitação da quantidade de pokemons por pagina = 10 por pagina, onde pagina é igual a 0. sera exibido so uma pagina
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}` // url da api com todos os pokemons

    return fetch(url) // devolveu uma promesse de response
        .then((response) => response.json()) // qndo a promesi for resolvida, vai pedir para converter o body para json
        .then((jsonBody) => jsonBody.results) // o body ja ta convertido, e eu vou pegar o resultado deste json que é a lista de pokemon
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // pokemons é a lista de pokemons, e estamos transformando em uma nova lista de detalhes dos pokemons. Que é uma nova requisiçao fetch(pokemon.url)

        .then((detailRequests) => Promise.all(detailRequests)) // detailRequests é a lista de requisição e estamos eseperando que todas as requisiçoes terminem
        .then((pokemonsDetails) => pokemonsDetails) // quando as requisições terminarem, vai devolver a lista de detalhes dos pokemons -> pokemonsDetails
        
        .catch((error) =>  console.error(error)) // tratamento de erro, casso algo der errado
}


