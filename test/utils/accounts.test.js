const chai = require('chai');
const {ADDRESS_HEX, ADDRESS_BASE58} = require('../helpers/config');
const liteWebBuilder = require('../helpers/liteWebBuilder');

const assert = chai.assert;

describe('LiteWeb.utils.accounts', function () {

    describe('#generateAccount()', function () {

        it("should generate a new account", async function () {
            const liteWeb = liteWebBuilder.createInstance();

            const newAccount = await liteWeb.utils.accounts.generateAccount();
            assert.equal(newAccount.privateKey.length, 64);
            assert.equal(newAccount.publicKey.length, 130);
            let address = liteWeb.address.fromPrivateKey(newAccount.privateKey);
            assert.equal(address, newAccount.address.base58);

            assert.equal(liteWeb.address.toHex(address), newAccount.address.hex.toLowerCase());
        });
    });
});
