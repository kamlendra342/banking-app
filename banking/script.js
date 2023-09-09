'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2023-09-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions



const formatMovementDate = function (date,acc) {
  const calcdayPassed = (date1, date2) => Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const dayspassed = calcdayPassed(new Date(), date);

  if (dayspassed === 0) return 'Today';
  if (dayspassed === 1) return 'yestaday';
  if (dayspassed <= 7) return `${dayspassed} days ago`;
  else {
    //  const day = `${date.getDate()}`.padStart(2, 0);
    //  const month = `${date.getMonth()}`.padStart(2, 0);
    //  const year = date.getFullYear();
    //  return `${day}/${month}/${year}`

    //or

    return Intl.DateTimeFormat(acc.locale).format(date);
  }
}



const formatcur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency:currency
  }).format(value);
}














const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  movs.forEach(function (mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    //////////////////////////////////////////////////////
    const date = new Date(acc.movementsDates[i])
    const displayDate = formatMovementDate(date,currentAccount);


    const formattedMOv =formatcur(mov,acc.locale,acc.currency)

///////////////////////////////
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
      } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMOv}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatcur(acc.balance,acc.locale,acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatcur(incomes,acc.locale,acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatcur(Math.abs(out),acc.locale,acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatcur(interest,acc.locale,acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount,timer;
//////////////////////////////////////////////


// experiment with api

const now = new Date();

const option = {
  day:'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'numeric',
  year: 'numeric',
  weekday:'long',
};
labelDate.textContent = new Intl.DateTimeFormat('en-UK',option).format(now);
//////////////////////////////////////

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
////////////////////////////////////////////////////////////////
    const now = new Date();

    const option = {
      day:'numeric',
      hour: 'numeric',
      minute: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday:'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,option).format(now);

        // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();




    if (timer) clearInterval(timer);
    timer=startlogOutTimer(); // timer of logout
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());

    // Update UI
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startlogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    setTimeout(function() {

      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());

      // Update UI
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startlogOutTimer();
      
    }, 2400);


    // // Add movement
    // currentAccount.movements.push(amount);
    // currentAccount.movementsDates.push(new Date());

    // // Update UI
    // updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);
    
    // Hide UI
    containerApp.style.opacity = 0;


  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});













/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

 // parsing

console.log(Number.parseInt('20px'));

console.log(Number.parseFloat('20.4rem'));


// creating a date

// console.log(now)
// const now = new Date();
// 
// console.log(new Date('Aug 03 3030 17:23:45'));
// 
// console.log(new Date('december 24, 2015'));
// 
// console.log(new Date(account1.movementsDates[0]));


// working with date 

const future = new Date(2037, 10, 19, 12, 23);
console.log(Number(future));
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());

const calcdayPassed = (date1, date2) => Math.abs((date2 - date1)/(1000*60*60*24)) ;

const days1 = calcdayPassed(new Date(2037, 3, 4), new Date(2037, 3,14));
console.log(days1) // ans we get in days it is diffrence between date in days form


//////////////////internationalisation ////////

const options = {
  style: 'currency',
  unit: 'celsius',
  currency:'USD'
}

const num = 4827642.23
console.log('US:', new Intl.NumberFormat('en-US',options).format(num));


///// SET TIMEOUT////// function executed once

const incrident=['olice','police']

const pizzaTimer=setTimeout((inc1,inc2) => console.log(`here is your pizza with ${inc1} and ${inc2}`), 3000,...incrident);
console.log('waiting....');


if (incrident.includes('oklice')) clearTimeout(pizzaTimer);

//set interval to do same work after a interval again and again

setInterval(function () {
  const now = new Date();
  //console.log(now);
}, 1000);



const startlogOutTimer = function () {
  // set time of 

  let time = 300;

  // call the timer every secound


const tick=function () {
  let sec = `${time % 60}`;
  labelTimer.textContent = `0${Math.trunc(time/60)}:${sec.padStart(2,0)}`;
  time--;
  if (time < 0) {
    containerApp.style.opacity = 0;
    clearInterval(timer);
    
  }
  
}
  tick();
  const timer = setInterval(tick, 1000);
  return timer
}