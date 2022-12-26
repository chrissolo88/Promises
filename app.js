let favNumber = Math.round(Math.random()*1000);
let factNumber = Math.round(Math.random()*5);
let baseNumbersURL = "http://numbersapi.com";
let baseCardsURL = "https://deckofcardsapi.com/api/deck"

$('#fact-btn').click((e) => {
  e.preventDefault()
  getFacts()})

function getFacts(){
  $("#facts").text('')
  favNumber = $('#favorite-number').val();
  factNumber = $('#fact-number').val()
  console.log(favNumber, factNumber)
  Promise.all(
    Array.from({ length: factNumber }, () => {
      return $.getJSON(`${baseNumbersURL}/${favNumber}?json`);
    })
  ).then(facts => {
    facts.forEach(data => $("#facts").append(`<p>${data.text}</p>`));
  });
}

const deck = {
  async init() {
    let res = await axios.get(`${baseCardsURL}/new/`)
    this.deckId = res.data.deck_id
  },
  async shuffle() {
    let res = await axios.get(`${baseCardsURL}/${this.deckId}/shuffle/`)
  },
  async drawCard() {
    let res = await axios.get(`${baseCardsURL}/${this.deckId}/draw/?count=1`)
    let cardCode = res.data.cards[0].code
    return cardImg = res.data.cards[0].image
    console.log(card, cardImg)
  }
}

async function prepdeck() {
  await deck.init();
  await deck.shuffle();
}
prepdeck()

$('#card-btn').click((e) => {
  e.preventDefault()
  getCard()})
async function getCard(){
  cardImg = await deck.drawCard()
  let angle = Math.random() * 90 - 45;
  let randomX = Math.random() * 40 - 20;
  let randomY = Math.random() * 40 - 20;
  $("#cards-area").append(
    $('<img>', {
      src: cardImg,
      css: {
        transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`
      }
    })
    )
}
// 3.
Promise.all(
  Array.from({ length: factNumber }, () => {
    return $.getJSON(`${baseNumbersURL}/${favNumber}?json`);
  })
).then(facts => {
  facts.forEach(data => $("#facts").append(`<p>${data.text}</p>`));
});

$('#pokemon-btn').click((e) => {
  e.preventDefault()
  insertPokemon()})

async function getPokemonArray() {
  const res = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=904')
  return pokemonArray = res.data.results
}

async function getPokeData(num){
  const pokeArray = await getPokemonArray();
  const pokeName = pokeArray[num].name
  const res = await axios.get(pokeArray[num].url)
  const desc = await axios.get(res.data.species.url)
  const pokeImg = res.data.sprites.front_default
  const pokeDescArr = desc.data.flavor_text_entries
  const pokeDesc = pokeDescArr.filter(val => {
    return val.language.name === "en"
  })

  console.log({'name' : pokeName, 'img' : pokeImg, 'desc' : pokeDesc[0]})
  return {'name' : pokeName, 'img' : pokeImg, 'desc' : pokeDesc[0].flavor_text}
}

async function insertPokemon() {
  $("#pokemon-area").text('')
  const randPokeNum = () => Math.floor(Math.random() * 903)
  const pokeNumbers = [randPokeNum(), randPokeNum(), randPokeNum()]
  for (const num of pokeNumbers){
    res = await getPokeData(num)
    console.log(res.name)
    pokeName = res.name
    $("#pokemon-area").append(
      `<div class="col-4">
        <div class="card">
          <img src="${res.img}" class="card-img-top pokemon" alt="..." style="width:180px; margin: auto;">
          <div class="card-body">
            <h5 class="card-title">${res.name}</h5>
            <p class="card-text">${res.desc}</p>
          </div>
        </div>
      </div>`
      );
  }
}