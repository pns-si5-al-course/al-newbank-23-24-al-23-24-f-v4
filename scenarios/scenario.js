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
console.log(chalk.green('Getting bank admin account...'));
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
console.log(chalk.green('Creating new bank account for user Tom in USD and CAD...'));
const accountUSD = await new Account(100, 'USD').postAccount();
const accountCAD = await new Account(200, 'CAD').postAccount();
const accountList = {"USD": accountUSD.id, "CAD": accountCAD.id};
const updateTom = await new UserUpdate(2, 'Tom', 12, Tom.mainAccountID, accountList).postUpdate();
console.log(chalk.green('New bank accounts for user Tom created!'));
console.log(chalk.yellow('-->', JSON.stringify(updateTom.accountList)));
await sleep(1000);

