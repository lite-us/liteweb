const liteWebBuilder = require('../helpers/liteWebBuilder');

module.exports = async function (func, pk, transaction) {
    const liteWeb = liteWebBuilder.createInstance();
    if( !transaction) {
        transaction = await func;
    }
    const signedTransaction = await liteWeb.xlt.sign(transaction, pk);
    const result = {
        transaction,
        signedTransaction,
        receipt: await liteWeb.xlt.sendRawTransaction(signedTransaction)
    };
    return Promise.resolve(result);
}
