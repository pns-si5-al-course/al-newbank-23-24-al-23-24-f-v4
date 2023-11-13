import axios from 'axios';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

class User {
    constructor(id, name, code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }

    async postUser() {
        return await post("http://localhost:3000/users", this);
    }
}

class UserUpdate {
    constructor(id, name, code, mainAccountID, accountList) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.mainAccountID = mainAccountID;
        this.account_list = accountList;
    }

    async postUpdate() {
        return await post("http://localhost:3000/users/update", this);
    }
}

class Account {
    constructor(sold, currency) {
        this.id = uuidv4();
        this.sold = sold;
        this.currency = currency;
    }

    async postAccount() {
        return await post("http://localhost:3000/accounts", this);
    }
}


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const bankAdminAccount = {name: 'BankAdmin', id: 1, EUR: "", accountList: {}};

async function get(url) {
  const response = await axios.get(url);
  return response.data;
}

async function post(url, data) {
    const response = await axios.post(url, data);
    return response.data;
  }

// Get bank admin account
// ----------------------------------
console.log(chalk.green('Getting bank admin user with his accounts...'));
const user = await get('http://localhost:3000/users?id=1');
bankAdminAccount.EUR = user.mainAccountID;
bankAdminAccount.accountList = user.accountList;
await sleep(2000);
// ----------------------------------


// create new user account for Tom
// ----------------------------------
console.log(chalk.green('Creating new user account for user Tom...'));
await sleep(1000);
const Tom = await new User(2, 'Tom', 12).postUser();
console.log(chalk.green('New user account for user Tom created!'));
console.log(Tom);


// create new bank account for in USD and CAD
// ----------------------------------
await sleep(2000);
console.log(chalk.blue('Creating new bank account for user Tom in USD and CAD...'));
const accountUSD = await new Account(100, 'USD').postAccount();
const accountCAD = await new Account(200, 'CAD').postAccount();
const accountList = {"USD": accountUSD.id, "CAD": accountCAD.id};
const updateTom = await new UserUpdate(2, 'Tom', 12, Tom.mainAccountID, accountList).postUpdate();
console.log(chalk.blue('New bank accounts for user Tom created!'));
console.log(chalk.yellow('-->', JSON.stringify(updateTom.accountList)));
console.log(chalk.yellow('-->', JSON.stringify(updateTom)));
await sleep(1000);

// create new user account for Jerry
// ----------------------------------
console.log(chalk.green('Creating new user account for user Jerry...'));
await sleep(1000);
const Jerry = await new User(3, 'Jerry', 13).postUser();
console.log(chalk.green('New user account for user Jerry created!'));
console.log(Jerry);

// create new bank account for in USD and BAM
// ----------------------------------
await sleep(2000);
console.log(chalk.blue('Creating new bank account for user Jerry in USD and BAM...'));
const accountUSD_Jerry = await new Account(100, 'USD').postAccount();
const accountBAM_Jerry = await new Account(200, 'BAM').postAccount();
const accountListJerry = {"USD": accountUSD_Jerry.id, "BAM": accountBAM_Jerry.id};
const updateJerry = await new UserUpdate(3, 'Jerry', 13, Jerry.mainAccountID, accountListJerry).postUpdate();
console.log(chalk.blue('New bank accounts for user Jerry created!'));
console.log(chalk.yellow('-->', JSON.stringify(updateJerry.accountList)));
console.log(chalk.yellow('-->', JSON.stringify(updateJerry)));
await sleep(1000);

// Tom sends 110 EUR to Jerry in BAM
// ----------------------------------
console.log(chalk.red('Tom want to send 110 EUR to Jerry in BAM...'));
await sleep(1000);
console.log(chalk.blue('Getting Tom EUR account...'));
const TomEUR = await get('http://localhost:3000/accounts?id=' + updateTom.mainAccountID);
await sleep(1000);
console.log(chalk.blue('Getting Jerry BAM account...'));
const JerryBAM = await get('http://localhost:3000/accounts?id=' + updateJerry.accountList.BAM);
await sleep(1000);
console.log(chalk.yellow('----------------------------------'));
console.log(chalk.yellow('Tom EUR account before payment -->', JSON.stringify(TomEUR)));
await sleep(1000);
console.log(chalk.yellow('Tom USD account before payment -->', JSON.stringify(await get('http://localhost:3000/accounts?id=' + updateTom.accountList.USD))));
await sleep(1000);
console.log(chalk.yellow('Tom CAD account before payment -->', JSON.stringify(await get('http://localhost:3000/accounts?id=' + updateTom.accountList.CAD))));
await sleep(1000);
console.log(chalk.yellow('----------------------------------'));
console.log(chalk.yellow('Jerry BAM account before payment -->', JSON.stringify(await get('http://localhost:3000/accounts?id=' + updateJerry.accountList.BAM))));
await sleep(1000);
console.log(chalk.red('Starting payment...'));
await sleep(1000);
await post('http://localhost:3000/payment?idUser=' + Tom.id + '&idDebited=' + TomEUR.id + '&idCredited=' + JerryBAM.id + '&source_currency=EUR&target_currency=BAM&amount=110');
console.log(chalk.red('Payment send!'));
console.log(chalk.yellow('Waiting for payment to be done...'));
await sleep(60000);
console.log(chalk.red('Payment done!'));
await sleep(1000);
console.log(chalk.yellow('----------------------------------'));
console.log(chalk.yellow('Tom EUR account after payment -->', JSON.stringify(await get('http://localhost:3000/accounts?id=' + updateTom.mainAccountID))));
await sleep(1000);
console.log(chalk.yellow('Tom USD account after payment -->', JSON.stringify(await get('http://localhost:3000/accounts?id=' + updateTom.accountList.USD))));
await sleep(1000);
console.log(chalk.yellow('Tom CAD account after payment -->', JSON.stringify(await get('http://localhost:3000/accounts?id=' + updateTom.accountList.CAD))));
await sleep(1000);
console.log(chalk.yellow('----------------------------------'));
console.log(chalk.yellow('Jerry BAM account after payment -->', JSON.stringify(await get('http://localhost:3000/accounts?id=' + updateJerry.accountList.BAM))));
