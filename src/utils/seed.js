const { Account } = require('../models/Account');
const accountsData = require('../../accounts.json');
const { databaseConnect, databaseClear, databaseClose } = require("./database");

async function seedAccounts() {
    console.log("Seeding accounts data");
    let result = await Account.insertMany(accountsData);
    console.log("Accounts seeded successfully:");
    console.log(result);
    return result;
  }


  async function seed() {
    await databaseConnect();
    await databaseClear();
  
    let newAccounts = await seedAccounts();
  
    console.log("Seeded data!");
    await databaseClose();
  }

seed();