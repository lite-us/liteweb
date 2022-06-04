const chai = require('chai');
const assert = chai.assert;
const wait = require('../../helpers/wait');
const assertThrow = require('../../helpers/assertThrow');
const broadcaster = require('../../helpers/broadcaster');
const _ = require('lodash');
const liteWebBuilder = require('../../helpers/liteWebBuilder');
const LiteWeb = liteWebBuilder.LiteWeb;

const testRevertContract = require('../../fixtures/contracts').testRevert;

describe('#contract.method', function () {

    let accounts;
    let liteWeb;
    let emptyAccount;

    before(async function () {
        liteWeb = liteWebBuilder.createInstance();
        // ALERT this works only with Lite Quickstart:
        accounts = await liteWebBuilder.getTestAccounts(-1);
        emptyAccount = await LiteWeb.createAccount();
    });

    describe('#send()', function () {

        let testRevert

        before(async function () {
            const tx = await broadcaster(liteWeb.transactionBuilder.createSmartContract({
                abi: testRevertContract.abi,
                bytecode: testRevertContract.bytecode
            }, accounts.b58[0]), accounts.pks[0])
            testRevert = await liteWeb.contract().at(tx.transaction.contract_address)
        })

        it("should set accounts[2] as the owner and check it with getOwner(1)", async function () {
            await testRevert.setOwner(accounts.b58[2]).send()
            assert.equal(await testRevert.getOwner(1).call(), accounts.hex[2])
        })

        it("should revert if trying to set TSeFTBYCy3r2kZNYsj86G6Yz6rsmPdYdFs as the owner", async function () {
            this.timeout(30000)
            await assertThrow(testRevert.setOwner('TSeFTBYCy3r2kZNYsj86G6Yz6rsmPdYdFs').send({shouldPollResponse: true}),
                null,
                'REVERT'
            )
        });

    });

    describe('#call()', function () {

        let testRevert

        before(async function () {
            const tx = await broadcaster(liteWeb.transactionBuilder.createSmartContract({
                abi: testRevertContract.abi,
                bytecode: testRevertContract.bytecode
            }, accounts.b58[0]), accounts.pks[0])
            testRevert = await liteWeb.contract().at(tx.transaction.contract_address)
            await testRevert.setOwner(accounts.b58[2]).send()
        })

        it("should getOwner(1) and get accounts[2]", async function () {
            assert.equal(await testRevert.getOwner(1).call(), accounts.hex[2])
        })

        it("should revert if call getOwner(2)", async function () {
            await assertThrow(testRevert.getOwner(2).call()
            )
        })

        it("should revert if call getOwner2()", async function () {
            await assertThrow(testRevert.getOwner2(2).call()
            )
        })

    });

});
