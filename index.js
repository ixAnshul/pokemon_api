const centeredDiv = document.getElementById("container");
const nextBtn = document.getElementById("next-btn");
const preBtn = document.getElementById("pre-btn");
const search = document.createElement("div");
search.id="search"
const pokemonLimits = document.createElement("input");
pokemonLimits.id="srch-field"
pokemonLimits.placeholder="page no."
const btn = document.createElement("div");
const main = document.createElement("div");
let pokemonsList = []; 
main.id = "main";
btn.id="btn"
btn.value = 50;
let count = 0;
let page =0;
async function init(){
    await callApi();
    await getPokemons();
}
init();
search.appendChild(pokemonLimits);
search.appendChild(btn);
centeredDiv.appendChild(search);
btn.addEventListener('click', async function(){
    const enteredPage = Number(pokemonLimits.value);
     if (isNaN(enteredPage) || enteredPage <= 0 || enteredPage > 130) {
        alert("Please enter a valid page number within 1-130");
    } else {
        count = enteredPage * 10;
        await getPokemons();
        page = enteredPage - 1;
        pageNumber();
    }
})

nextBtn.addEventListener('click', async function(){
    if(page<131){
    count+=10;
    main.innerHTML = "";
    await getPokemons();
    pageNumber(1);
    }
})
preBtn.addEventListener('click', async function(){
    if(page >=1){
    count-=10;
    main.innerHTML = "";
    await getPokemons();
    pageNumber(-1);
    }
})

async function callApi(limit = 1302){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${limit}`);
    const cards = await response.json();
    pokemonsList = cards.results
}

async function getPokemons(value = count) {
    main.innerHTML = "";

    for (let index = value; index < value+10 && index <= pokemonsList.length; index++) {
        const pokemonMain = document.createElement("div");
        pokemonMain.id = "poke-container";
        const pokemonCard = document.createElement("p");
        const pokemonImg = document.createElement("img");
        pokemonImg.id= "poke-img";
        if(index<1025){
            pokemonImg.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${index+1}.png`
        }else{
            pokemonImg.src="https://i.pngimg.me/thumb/f/720/m2i8N4N4K9H7H7N4.jpg"
        }
        pokemonMain.appendChild(pokemonImg);
        pokemonCard.id = "pokemon-name";
        const pokemonName = document.createTextNode(pokemonsList[index].name);
        pokemonCard.appendChild(pokemonName);
        pokemonMain.appendChild(pokemonCard);
        main.appendChild(pokemonMain);
    }
}
function pageNumber(value=1) {
    page = page+value;
    document.getElementById('page-num').innerText = page;
}


centeredDiv.appendChild(main);
