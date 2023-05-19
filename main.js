const searchWrapper = document.querySelector(".search-line");
const inputBox = document.querySelector(".search-line__input");
const autocomBox = document.querySelector(".autocom-box");
const searchList = document.getElementsByTagName("li");
const app = document.querySelector('.app');

function debounce(fn) {
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(this, arguments);
        }, 400);
    };
}

inputBox.addEventListener("input", debounce(handleUserInput));

async function handleUserInput(e) {
    try {
        let userData = e.target.value;
        if (userData) {
            let request = await getRequest(userData);
            let shortArr = showRequest(request);
            addRepoArr(shortArr);
        } else {
            autocomBox.classList.remove("autocom-box--active");
        }
    } catch (err) {
        autocomBox.classList.remove("autocom-box--active");
    }
}

function getRequest(userData) {
    return fetch(`https://api.github.com/search/repositories?q=${userData}&per_page=5`)
        .then(response => response.json());
}

function showRequest(request) {
    try {
        let nameRepo = request.items.map(({ name }) => {
            return name;
        });
        nameRepo = nameRepo.map((name) => {
            return `<li>${name}</li>`;
        });
        autocomBox.innerHTML = nameRepo.join("");
        autocomBox.classList.add('autocom-box--active');
    } catch (error) {
        autocomBox.classList.remove("autocom-box--active");
    }
    return request.items;
}

function addCard(selectedRepoName, fiveRepo) {
    inputBox.value = '';
    autocomBox.classList.remove("autocom-box--active");
    const card = document.createElement('div');
    card.classList.add('card');
    const cardItems = document.createElement('ul');
    cardItems.classList.add('card-items');
    const name = document.createElement('li');
    const selectedRepo = fiveRepo.find(repo => repo.name === selectedRepoName);
    const nameRepo = selectedRepo.name;
    name.textContent = `Name: ${nameRepo}`;
    const owner = document.createElement('li');
    const ownerLogin = selectedRepo.owner.login;
    owner.textContent = `Owner: ${ownerLogin}`;
    const stars = document.createElement('li');
    const starsCount = selectedRepo.stargazers_count;
    stars.textContent = `Stars: ${starsCount}`;
    const btn = document.createElement('button');
    btn.classList.add('cross');
    const span = document.createElement('span');
    span.classList.add('cross__line');
    card.appendChild(cardItems);
    cardItems.appendChild(name);
    cardItems.appendChild(owner);
    cardItems.appendChild(stars);
    card.appendChild(btn);
    btn.appendChild(span);
    btn.appendChild(span.cloneNode(true));
    app.appendChild(card);

    btn.addEventListener('click', function () {
        card.remove();
    });
}

function addRepoArr(fiveRepo) {
    let listArr = Array.from(searchList);
    listArr.forEach((item) => {
        item.addEventListener('click', function (e) {
            const selectedRepoName = e.target.textContent;
            addCard(selectedRepoName, fiveRepo);
        });
    });
};














