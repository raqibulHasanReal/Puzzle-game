const log = (value) => {
    console.log(value);
}

// declaring card list
const cardSetTwoByTwo = ['linux', 'linux', 'windows', 'windows'];
const cardSetFourByFour = ['skype', 'skype', 'slack', 'slack', 'github', 'github', 'money', 'money', 'heart', 'heart', 'wheelchair', 'wheelchair'];
var cardSet = [...cardSetTwoByTwo];

//user variable
let user = JSON.parse(localStorage.getItem('user'));

//valid email format
const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

let counter = 0;
let openCards = [];

let second = minute = hour = 0;
const timer = document.getElementById("time");
let interval;

let success = 0;

// declare modal
const modal = document.getElementById("modal")
const userDataModal = document.getElementById('inputModal');

//set card on load
document.body.onload = loadGame();

function loadGame() {
    if (user) {
        setName(user.name);
    } else {
        userDataModal.classList.add("show");
    }
    setCardGrid(cardSet);
}

function setName(name) {
    document.getElementById("yourName").innerHTML = name; 
}

function setCardGrid(list) {
    var totalIndex = list.length;
    while(totalIndex !== 0) {
        randomIndex = Math.floor(Math.random() * totalIndex);
        totalIndex -= 1;
        tempValue = list[totalIndex];
        list[totalIndex] = list[randomIndex];
        list[randomIndex] = tempValue;
    }
    resetOpenCard();
    resetTimeAndCount();
    return renderList(list);
}

function resetOpenCard() {
    openCards = [];
    success = 0;
    document.getElementById("success").innerHTML = `success ${success}`;
}

function renderList(list) {
    const cardClass = list.length === 4 ? 'large' : '';
    document.getElementById("card").innerHTML = null;
    list.forEach(type => {
            const list = `<li class="card ${cardClass}" type=${type} onclick=flipCard(this)><i class="fa fa-${type}" aria-hidden="true"></i></li>`;
            document.getElementById("card").innerHTML += list;
        })
}

function flipCard(card) {
    openCards.push(card);
    let lenth = openCards.length;
    card.classList.add("open", "disabled");
    if(2 === lenth) {
        setCounter();
        if (openCards[0].type === openCards[1].type) {
            cardMatch();
        } else {
            cardUnmatch();
        }
    }
}

function cardMatch() {
    success++;
    openCards[0].classList.add("match", "disabled");
    openCards[1].classList.add("match", "disabled");
    openCards[0].classList.remove("open");
    openCards[1].classList.remove("open");
    document.getElementById("success").innerHTML = `success ${success}`;
    openCards = [];
    if(success === cardSet.length/2) {
        openModal();
    }
}

function openModal() {
    clearInterval(interval);
    const finalTime = document.getElementById("time").innerHTML;
    modal.classList.add("show");

    document.getElementById("totalCounter").innerHTML = counter;
    document.getElementById("totalTime").innerHTML = finalTime
}

function playAgain() {
    modal.classList.remove("show");
    resetGame(cardSet);
} 

function cardUnmatch() {
    openCards[0].classList.add("unmatched");
    openCards[1].classList.add("unmatched");

    const card = document.getElementsByClassName("card");
    const cards = [...card];

    disableOtherCards(cards);
    setTimeout(function () {
        openCards[0].classList.remove("open", "unmatched");
        openCards[1].classList.remove("open", "unmatched");
        openCards = [];
        enableOtherCards(cards);
    }, 1500);
}

function disableOtherCards(cards) {
    cards.forEach(card => {
        card.classList.add('disabled');
    });
}

function enableOtherCards(cards) {
    cards.forEach(card => {
        card.classList.remove('disabled');
    });
}

function setDymension() {
    const dymension = document.getElementById('cardDymension').value;
    if ('fourByFour' === dymension) {
        cardSet = cardSet.concat(cardSetFourByFour);
    } else if ('twoByTwo' === dymension) {
        cardSet = [...cardSetTwoByTwo];
    }
    setCardGrid(cardSet, true);
}

function resetGame() {
    setCardGrid(cardSet);
}

function resetTimeAndCount() {
    counter = second = minute = hour = 0;
    var timer = document.getElementById("time");
    timer.innerHTML = "0 hour 0 min 0 sec";
    document.getElementById('counter').innerHTML = `${counter} move(s)`;
    clearInterval(interval);
}

//stopwatch
function startTimer() {
    interval = setInterval(function () {
        second++;
        timer.innerHTML = `${hour} hour ${minute} min ${second} sec`;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

//set counter
function setCounter() {
    counter++;
    document.getElementById('counter').innerHTML = `${counter} move(s)` ;
    if (counter == 1) {
        second = minute = hour = 0;
        startTimer();
    }
}

function saveUserInput() {
    const name = document.getElementById("userName");
    const email = document.getElementById("userEmail");
    if(!name.value) {
        name.focus();
        name.classList.add('error');
        email.classList.remove('error');
    } else if (!email.value || !email.value.match(mailformat)) {
        email.value = null;
        email.placeholder = "please input a valid email";
        email.focus();
        name.classList.remove('error');
        email.classList.add('error');
    } else {
        //remove all input css error
        name.classList.remove('error');
        email.classList.remove('error');

        //remove modal
        userDataModal.classList.remove("show");

        // store data in local store
        localStorage.setItem("user", JSON.stringify({ "name": name.value, "email": email.value }));
        setUserData();
    }
}

function setUserData() {
    user = JSON.parse(localStorage.getItem('user'));
    setName(user.name);
}

function logOut() {
    setCardGrid(cardSet);
    localStorage.removeItem("user");
    user = null;
    userDataModal.classList.add("show");
}