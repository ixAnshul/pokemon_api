const centeredDiv = document.getElementById("container");
const nextBtn = document.getElementById("next-btn");
const preBtn = document.getElementById("pre-btn");
const search = document.createElement("div");
search.id = "search";
const pokemonLimits = document.createElement("select");
const option1 = document.createElement("option");
option1.value = "10";
option1.textContent = "10";
const handleClick = async function () {
    await callApi(count, Number(pokemonLimits.value));
    setTimeout(async function () {
        getPokemons(Number(pokemonLimits.value));
    }, 5000);
    renderLoadingScreen();
};
async function handleNextClick() {
    if (count < 1302) {
        count += Number(pokemonLimits.value);
        await callApi(count, Number(pokemonLimits.value));
        main.innerHTML = "";
        await getPokemons();
        pageNumber(1);
    }
}
async function handlePreClick() {
    count -= Number(pokemonLimits.value);
    if (count < 0) {
        count = 0;
        // preBtn.style.display
    }
    if (page > 0) {
        await callApi(count, Number(pokemonLimits.value));
        main.innerHTML = "";
        await getPokemons();
        pageNumber(-1);
    }
}

const debouncedClick = debounce(handleClick, 1000);
const debouncedNextClick = debounce(handleNextClick, 1000);
const debouncedPreClick = debounce(handlePreClick, 1000);
const option2 = document.createElement("option");
option2.value = "50";
option2.textContent = "50";

const option3 = document.createElement("option");
option3.value = "100";
option3.textContent = "100";

pokemonLimits.appendChild(option1);
pokemonLimits.appendChild(option2);
pokemonLimits.appendChild(option3);
pokemonLimits.id = "srch-field";
const btn = document.createElement("div");
const main = document.createElement("div");
let pokemonsList = [];
main.id = "main";
btn.id = "btn";
btn.value = 50;
let count = 0;
let page = 0;
const loadingScreenArray = [
    "Loading Pokémon cards. Gotta catch 'em all! 🌟",
    "Unleashing Pokémon magic. Loading your card adventure!",
    "Searching for rare Pokémon cards. Please wait patiently.",
    "Charging up Pokéballs. Loading your favorite Pokémon cards!",
    "Training Pokémon trainers. Loading the card collection journey.",
    "Embarking on a Pokémon quest. Loading cards, one Pikachu at a time.",
    "Evolution in progress. Loading the ultimate Pokémon card experience.",
    "Gearing up for a Pokémon battle. Loading cards for the showdown!",
    "Building your Pokémon deck. Loading cards for epic battles!",
    "Pokémon journey loading... Sit tight, trainers!",
    "Unlocking Pokédex secrets. Loading your Pokémon card world.",
];

const imgTypes = {
    bug: "#26de81",
    dragon: "#ffeaa2",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#EFB549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190FF",
    steel: "#95afc0",
    dark: "#2d3436",
    flying: "#81ecec",
    bug: "#26de81",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    ghost: "#a55eea",
    ice: "#74b9ff",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    dark: "#2d3436",
    steel: "#95afc0",
    dragon: "#ffeaa2",
};

const init = async () => {
    await callApi(0, 10);
    renderLoadingScreen();
    setTimeout(async function () {
        await getPokemons();
    }, 5000);
};

search.appendChild(pokemonLimits);
search.appendChild(btn);
centeredDiv.appendChild(search);
btn.addEventListener("click", debouncedClick);


btn.addEventListener("click", debouncedClick);

nextBtn.addEventListener("click", debouncedNextClick);
preBtn.addEventListener("click", debouncedPreClick);

async function callApi(start = 0, limit = 20) {
    console.log(start, limit, "api")
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${start}&limit=${limit}`
    );
    pokemonsList = [];
    const cards = await response.json();
    pokemonsList = cards.results;
}

const getPokemons = async () => {
    main.innerHTML = "";

    for (const pokemonData of pokemonsList) {
        const pokemonMain = document.createElement("div");
        pokemonMain.id = "poke-container";

        const pokemonCard = document.createElement("p");
        const pokemonImg = document.createElement("img");
        const imgBTN = document.createElement("div");
        imgBTN.id = "imgBTN";

        const normal = createPokeball("normal.png");
        const SHINY = createPokeball("shiny.png");
        const GIFFY = createPokeball("giffy.png");

        const pokeTypes = document.createElement("div");
        pokeTypes.innerHTML = await getTypes(pokemonData.url);
        pokeTypes.id = "giffy";

        pokemonImg.id = "poke-img";
        imgBTN.append(normal, SHINY, GIFFY);

        const pokemonProfile = await getImage(pokemonData.url);

        if (pokemonProfile) {
            pokemonImg.src = pokemonProfile;
        } else {
            pokemonImg.src = "goLoader.gif";
        }

        const pokemonsName = pokemonData.name;
        const pokemonName = document.createTextNode(pokemonsName.toUpperCase());

        pokemonCard.id = "pokemon-name";
        pokemonCard.appendChild(pokemonName);

        pokemonMain.append(pokemonImg, imgBTN, pokeTypes, pokemonCard);
        main.appendChild(pokemonMain);

        normal.addEventListener("click", async function () {
            await handleButtonClick(1);
        });

        SHINY.addEventListener("click", async function () {
            await handleButtonClick(2);
        });

        GIFFY.addEventListener("click", async function () {
            await handleButtonClick(3);
        });

        async function handleButtonClick(buttonType) {
            pokeImg();
            setTimeout(async function () {
                const imgURL = await getImage(pokemonData.url, buttonType);
                pokemonImg.src = imgURL;
            }, buttonType === 3 ? 5000 : 4000);
        }

        function pokeImg() {
            pokemonImg.src = "loading_pokeball.gif";
        }

        async function getTypes(url) {
            const response = await fetch(url);
            const cards = await response.json();
            const poketypes = cards.types.map(type => type.type.name);

            const result = imgTypes[poketypes[0]];

            if (result) {
                pokemonMain.style.backgroundColor = result;
            }

            return poketypes;
        }
    }
}

function createPokeball(src) {
    const pokeball = document.createElement("img");
    pokeball.className = "pokeball";
    pokeball.src = src;
    pokeball.id = src.split('.')[0]; // Assuming file names are consistent
    return pokeball;
}


async function getImage(url, btnNum) {
    const response = await fetch(url);
    const cards = await response.json();
    // console.log(cards, "cards");
    let pokemonImage = '';
    if (btnNum == 2) {
        pokemonImage = cards.sprites.other.home.front_default;
    } else if (btnNum == 3) {
        pokemonImage = cards.sprites.other.showdown.front_shiny;
    } else {
        pokemonImage = cards.sprites.other.dream_world.front_default;
    }
    if (!pokemonImage || pokemonImage == null) {
        pokemonImage = cards.sprites.front_default;
    }
    return pokemonImage;
}
async function getTypes(url) {
    const response = await fetch(url);
    const cards = await response.json();
    const poketypes = [];
    cards.types.map((types) => {
        poketypes.push(types.type.name);
    });
    const typename = cards.types[0].type.name;
    const result = imgTypes[typename];

    if (result) {
        document.getElementById("poke-container").style.backgroundColor = result;
    }

    return poketypes;
}
function pageNumber(value = 1) {
    page = Math.ceil(count / Number(pokemonLimits.value));
    document.getElementById("page-num").innerText = page;
    // console.log(page);
}

const renderLoadingScreen = () => {
    main.innerHTML = "";
    const loadingScreen = document.createElement("div");
    loadingScreen.id = "loading-screen";
    const pokeLoader = document.createElement("img");
    pokeLoader.src =
        "screenloader.gif";
    pokeLoader.style.width = "22rem";
    pokeLoader.style.height = "20rem";
    pokeLoader.style.borderRadius = "50%";
    const textLoader = document.createElement("p");
    textLoader.id = "loading-text";
    const randomIndex = Math.floor(Math.random() * loadingScreenArray.length);
    textLoader.innerText = loadingScreenArray[randomIndex];
    loadingScreen.appendChild(pokeLoader);
    loadingScreen.appendChild(textLoader);
    main.appendChild(loadingScreen);
};
function debounce(func, timeout = 800) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}
centeredDiv.appendChild(main);
init();
