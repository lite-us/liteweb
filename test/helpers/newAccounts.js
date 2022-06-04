const liteWebBuilder = require('./liteWebBuilder');
const liteWeb = liteWebBuilder.createInstance();

const amount = process.argv[2] || 10;

(async function () {
    await liteWebBuilder.newTestAccounts(amount)
})()

