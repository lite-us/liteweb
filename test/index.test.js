const chai = require('chai');
const {ADDRESS_HEX, ADDRESS_BASE58, FULL_NODE_API, SOLIDITY_NODE_API, EVENT_API, PRIVATE_KEY} = require('./helpers/config');
const liteWebBuilder = require('./helpers/liteWebBuilder');
const LiteWeb = liteWebBuilder.LiteWeb;
const log = require('./helpers/log')
const BigNumber = require('bignumber.js');
const broadcaster = require('./helpers/broadcaster');
const wait = require('./helpers/wait')


const assert = chai.assert;
const HttpProvider = LiteWeb.providers.HttpProvider;

describe('LiteWeb Instance', function () {

    describe('#constructor()', function () {
        it('should create a full instance', function () {
            const liteWeb = liteWebBuilder.createInstance();
            assert.instanceOf(liteWeb, LiteWeb);
        });

        it('should create an instance using an options object without private key', function () {
            const fullNode = new HttpProvider(FULL_NODE_API);
            const solidityNode = new HttpProvider(SOLIDITY_NODE_API);
            const eventServer = EVENT_API;

            const liteWeb = new LiteWeb({
                fullNode,
                solidityNode,
                eventServer
            });

            assert.equal(liteWeb.defaultPrivateKey, false);
        });

        it('should create an instance using a full options object', function () {
            const fullNode = FULL_NODE_API;
            const solidityNode = SOLIDITY_NODE_API;
            const eventServer = EVENT_API;
            const privateKey = PRIVATE_KEY;

            const liteWeb = new LiteWeb({
                fullNode,
                solidityNode,
                eventServer,
                privateKey
            });

            assert.equal(liteWeb.defaultPrivateKey, privateKey);
        });

        it('should create an instance without a private key', function () {
            const fullNode = new HttpProvider(FULL_NODE_API);
            const solidityNode = new HttpProvider(SOLIDITY_NODE_API);
            const eventServer = EVENT_API;

            const liteWeb = new LiteWeb(
                fullNode,
                solidityNode,
                eventServer
            );

            assert.equal(liteWeb.defaultPrivateKey, false);
        });

        it('should create an instance without an event server', function () {
            const fullNode = new HttpProvider(FULL_NODE_API);
            const solidityNode = new HttpProvider(SOLIDITY_NODE_API);

            const liteWeb = new LiteWeb(
                fullNode,
                solidityNode
            );

            assert.equal(liteWeb.eventServer, false);
        });

        it('should reject an invalid full node URL', function () {
            const solidityNode = new HttpProvider(SOLIDITY_NODE_API);

            assert.throws(() => new LiteWeb(
                '$' + FULL_NODE_API,
                solidityNode
            ), 'Invalid URL provided to HttpProvider');
        });

        it('should reject an invalid solidity node URL', function () {
            const fullNode = new HttpProvider(FULL_NODE_API);

            assert.throws(() => new LiteWeb(
                fullNode,
                '$' + SOLIDITY_NODE_API
            ), 'Invalid URL provided to HttpProvider');
        });

        it('should reject an invalid event server URL', function () {
            const fullNode = new HttpProvider(FULL_NODE_API);
            const solidityNode = new HttpProvider(SOLIDITY_NODE_API);

            assert.throws(() => new LiteWeb(
                fullNode,
                solidityNode,
                '$' + EVENT_API
            ), 'Invalid URL provided to HttpProvider');
        });
    });

    describe('#version()', function () {
        it('should verify that the version is available as static and non-static property', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.equal(typeof liteWeb.version, 'string');
            assert.equal(typeof LiteWeb.version, 'string');
        });
    });


    describe('#fullnodeVersion()', function () {
        it('should verify that the version of the fullNode is available', function () {
            const liteWeb = liteWebBuilder.createInstance();
            // setTimeout(() => console.log(liteWeb.fullnodeVersion), 500)
            assert.equal(typeof liteWeb.fullnodeVersion, 'string');

        });
    });

    describe('#setDefaultBlock()', function () {
        it('should accept a positive integer', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setDefaultBlock(1);

            assert.equal(liteWeb.defaultBlock, 1);
        });

        it('should correct a negative integer', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setDefaultBlock(-2);

            assert.equal(liteWeb.defaultBlock, 2);
        });

        it('should accept 0', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setDefaultBlock(0);

            assert.equal(liteWeb.defaultBlock, 0);
        });

        it('should be able to clear', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setDefaultBlock();

            assert.equal(liteWeb.defaultBlock, false);
        });

        it('should accept "earliest"', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setDefaultBlock('earliest');

            assert.equal(liteWeb.defaultBlock, 'earliest');
        });

        it('should accept "latest"', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setDefaultBlock('latest');

            assert.equal(liteWeb.defaultBlock, 'latest');
        });

        it('should reject a decimal', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.throws(() => liteWeb.setDefaultBlock(10.2), 'Invalid block ID provided');
        });

        it('should reject a string', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.throws(() => liteWeb.setDefaultBlock('test'), 'Invalid block ID provided');
        });
    });

    describe('#setPrivateKey()', function () {
        it('should accept a private key', function () {
            const liteWeb = new LiteWeb(FULL_NODE_API, SOLIDITY_NODE_API, EVENT_API);

            liteWeb.setPrivateKey(PRIVATE_KEY);

            assert.equal(liteWeb.defaultPrivateKey, PRIVATE_KEY);
        });

        it('should set the appropriate address for the private key', function () {
            const liteWeb = new LiteWeb(FULL_NODE_API, SOLIDITY_NODE_API, EVENT_API);

            liteWeb.setPrivateKey(PRIVATE_KEY);

            assert.equal(liteWeb.defaultAddress.hex, ADDRESS_HEX);
            assert.equal(liteWeb.defaultAddress.base58, ADDRESS_BASE58);
        });

        it('should reject an invalid private key', function () {
            const liteWeb = new LiteWeb(FULL_NODE_API, SOLIDITY_NODE_API, EVENT_API);

            assert.throws(() => liteWeb.setPrivateKey('test'), 'Invalid private key provided');
        });

        it('should emit a privateKeyChanged event', function (done) {
            this.timeout(1000);

            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.on('privateKeyChanged', privateKey => {
                done(
                    assert.equal(privateKey, PRIVATE_KEY)
                );
            });

            liteWeb.setPrivateKey(PRIVATE_KEY);
        });
    });

    describe('#setAddress()', function () {
        it('should accept a hex address', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setAddress(ADDRESS_HEX);

            assert.equal(liteWeb.defaultAddress.hex, ADDRESS_HEX);
            assert.equal(liteWeb.defaultAddress.base58, ADDRESS_BASE58);
        });

        it('should accept a base58 address', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setAddress(ADDRESS_BASE58);

            assert.equal(liteWeb.defaultAddress.hex, ADDRESS_HEX);
            assert.equal(liteWeb.defaultAddress.base58, ADDRESS_BASE58);
        });

        it('should reset the private key if the address doesn\'t match', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.equal(liteWeb.defaultPrivateKey, PRIVATE_KEY);

            liteWeb.setAddress(
                ADDRESS_HEX.substr(0, ADDRESS_HEX.length - 1) + '8'
            );

            assert.equal(liteWeb.defaultPrivateKey, false);
            assert.equal(liteWeb.defaultAddress.hex, '41928c9af0651632157ef27a2cf17ca72c575a4d28');
            assert.equal(liteWeb.defaultAddress.base58, 'TPL66VK2gCXNCD7EJg9pgJRfqcRbnn4zcp');
        });

        it('should not reset the private key if the address matches', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setAddress(ADDRESS_BASE58);

            assert.equal(liteWeb.defaultPrivateKey, PRIVATE_KEY);
        });

        it('should emit an addressChanged event', function (done) {
            this.timeout(1000);

            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.on('addressChanged', ({hex, base58}) => {
                done(
                    assert.equal(hex, ADDRESS_HEX) &&
                    assert.equal(base58, ADDRESS_BASE58)
                );
            });

            liteWeb.setAddress(ADDRESS_BASE58);
        });
    });

    describe('#isValidProvider()', function () {
        it('should accept a valid provider', function () {
            const liteWeb = liteWebBuilder.createInstance();
            const provider = new HttpProvider(FULL_NODE_API);

            assert.equal(liteWeb.isValidProvider(provider), true);
        });

        it('should accept an invalid provider', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.equal(liteWeb.isValidProvider('test'), false);
        });
    });

    describe('#setFullNode()', function () {
        it('should accept a HttpProvider instance', function () {
            const liteWeb = liteWebBuilder.createInstance();
            const provider = new HttpProvider(FULL_NODE_API);

            liteWeb.setFullNode(provider);

            assert.equal(liteWeb.fullNode, provider);
        });

        it('should accept a valid URL string', function () {
            const liteWeb = liteWebBuilder.createInstance();
            const provider = FULL_NODE_API;

            liteWeb.setFullNode(provider);

            assert.equal(liteWeb.fullNode.host, provider);
        });

        it('should reject a non-string', function () {
            assert.throws(() => {
                liteWebBuilder.createInstance().setFullNode(true)
            }, 'Invalid full node provided');
        });

        it('should reject an invalid URL string', function () {
            assert.throws(() => {
                liteWebBuilder.createInstance().setFullNode('example.')
            }, 'Invalid URL provided to HttpProvider');
        });
    });

    describe('#setSolidityNode()', function () {
        it('should accept a HttpProvider instance', function () {
            const liteWeb = liteWebBuilder.createInstance();
            const provider = new HttpProvider(SOLIDITY_NODE_API);

            liteWeb.setSolidityNode(provider);

            assert.equal(liteWeb.solidityNode, provider);
        });

        it('should accept a valid URL string', function () {
            const liteWeb = liteWebBuilder.createInstance();
            const provider = SOLIDITY_NODE_API;

            liteWeb.setSolidityNode(provider);

            assert.equal(liteWeb.solidityNode.host, provider);
        });

        it('should reject a non-string', function () {
            assert.throws(() => {
                liteWebBuilder.createInstance().setSolidityNode(true)
            }, 'Invalid solidity node provided');
        });

        it('should reject an invalid URL string', function () {
            assert.throws(() => {
                liteWebBuilder.createInstance().setSolidityNode('_localhost')
            }, 'Invalid URL provided to HttpProvider');
        });
    });

    describe('#setEventServer()', function () {
        it('should accept a valid URL string', function () {
            const liteWeb = liteWebBuilder.createInstance();
            const eventServer = EVENT_API;

            liteWeb.setEventServer(eventServer);

            assert.equal(liteWeb.eventServer.host, eventServer);
        });

        it('should reset the event server property', function () {
            const liteWeb = liteWebBuilder.createInstance();

            liteWeb.setEventServer(false);

            assert.equal(liteWeb.eventServer, false);
        });

        it('should reject an invalid URL string', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.throws(() => {
                liteWeb.setEventServer('test%20')
            }, 'Invalid URL provided to HttpProvider');
        });

        it('should reject an invalid URL parameter', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.throws(() => {
                liteWeb.setEventServer({})
            }, 'Invalid event server provided');
        });
    });

    describe('#currentProviders()', function () {
        it('should return the current providers', function () {
            const liteWeb = liteWebBuilder.createInstance();
            const providers = liteWeb.currentProviders();

            assert.equal(providers.fullNode.host, FULL_NODE_API);
            assert.equal(providers.solidityNode.host, SOLIDITY_NODE_API);
            assert.equal(providers.eventServer.host, EVENT_API);
        });
    });

    describe('#currentProvider()', function () {
        it('should return the current providers', function () {
            const liteWeb = liteWebBuilder.createInstance();
            const providers = liteWeb.currentProvider();

            assert.equal(providers.fullNode.host, FULL_NODE_API);
            assert.equal(providers.solidityNode.host, SOLIDITY_NODE_API);
            assert.equal(providers.eventServer.host, EVENT_API);
        });
    });

    describe('#sha3()', function () {
        it('should match web3 sha function', function () {
            const input = 'casa';
            const expected = '0xc4388c0eaeca8d8b4f48786df8517bc8ca379e8cf9566af774448e46e816657d';

            assert.equal(LiteWeb.sha3(input), expected);
        });
    });

    describe('#toHex()', function () {
        it('should convert a boolean to hex', function () {
            let input = true;
            let expected = '0x1';
            assert.equal(LiteWeb.toHex(input), expected);

            input = false;
            expected = '0x0';
            assert.equal(LiteWeb.toHex(input), expected);
        });

        it('should convert a BigNumber to hex', function () {
            let input = BigNumber('123456.7e-3');
            let expected = '0x7b.74ea4a8c154c985f06f7';
            assert.equal(LiteWeb.toHex(input), expected);

            input = new BigNumber(89273674656);
            expected = '0x14c9202ba0';
            assert.equal(LiteWeb.toHex(input), expected);

            input = BigNumber('23e89');
            expected = '0x1210c23ede2d38fed455e938516db71cfaf3ec4a1c8f3fa92f98a60000000000000000000000';
            assert.equal(LiteWeb.toHex(input), expected);
        });

        it('should convert an object to an hex string', function () {
            let input = {address: 'TTRjVyHu1Lv3DjBPTgzCwsjCvsQaHKQcmN'};
            let expected = '0x7b2261646472657373223a225454526a56794875314c7633446a425054677a4377736a4376735161484b51636d4e227d';
            assert.equal(LiteWeb.toHex(input), expected);

            input = [1, 2, 3];
            expected = '0x5b312c322c335d';
            assert.equal(LiteWeb.toHex(input), expected);
        });

        it('should convert a string to hex', function () {
            let input = 'salamon';
            let expected = '0x73616c616d6f6e';
            assert.equal(LiteWeb.toHex(input), expected);
        });

        it('should leave an hex string as is', function () {
            let input = '0x73616c616d6f6e';
            let expected = '0x73616c616d6f6e';
            assert.equal(LiteWeb.toHex(input), expected);
        });

        it('should convert a number to an hex string', function () {
            let input = 24354;
            let expected = '0x5f22';
            assert.equal(LiteWeb.toHex(input), expected);

            input = -423e-2;
            expected = '-0x4.3ae147ae147ae147ae14';
            assert.equal(LiteWeb.toHex(input), expected);
        });

        it('should throw an error if the value is not convertible', function () {

            assert.throws(() => {
                LiteWeb.toHex(LiteWeb)
            }, 'The passed value is not convertible to a hex string');
        });

    });

    describe("#toUtf8", function () {

        it("should convert an hex string to utf8", function () {

            let input = '0x73616c616d6f6e';
            let expected = 'salamon';
            assert.equal(LiteWeb.toUtf8(input), expected);

        });

        it("should convert an hex string to utf8", function () {

            let input = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
            let expected = '机械及行业设备';
            assert.equal(LiteWeb.toUtf8(input), expected);

        });

        it('should throw an error if the string is not a valid hex string in strict mode', function () {
            let input = 'salamon';

            assert.throws(() => {
                LiteWeb.toUtf8(input, true)
            }, 'The passed value is not a valid hex string');
        });

    });

    describe("#fromUtf8", function () {

        it("should convert an utf-8 string to hex", function () {

            let input = 'salamon';
            let expected = '0x73616c616d6f6e';
            assert.equal(LiteWeb.fromUtf8(input), expected);

            input = '机械及行业设备';
            expected = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
            assert.equal(LiteWeb.fromUtf8(input), expected);

        });

        it('should throw an error if the utf-8 string is not a string', function () {
            assert.throws(() => {
                LiteWeb.fromUtf8([])
            }, 'The passed value is not a valid utf-8 string');
        });

    });

    describe("#toAscii", function () {

        it("should convert a hex string to ascii", function () {

            let input = '0x73616c616d6f6e';
            let expected = 'salamon';
            assert.equal(LiteWeb.toAscii(input), expected);

            input = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
            expected = 'æºæ¢°åè¡ä¸è®¾å¤';
            // 'f\u001c:f"0e\u000f\nh!\fd8\u001ah.>e$\u0007';
            assert.equal(LiteWeb.toAscii(input), expected);
        });

        it('should throw an error if the string is not a valid hex string', function () {
            let input = 'salamon';
            assert.throws(() => {
                LiteWeb.toAscii(input)
            }, 'The passed value is not a valid hex string');
        });

    });

    describe("#fromAscii", function () {

        it("should convert an ascii string to hex", function () {

            let input = 'salamon';
            let expected = '0x73616c616d6f6e';
            assert.equal(LiteWeb.fromAscii(input), expected);

            input = 'æºæ¢°åè¡ä¸è®¾å¤';
            expected = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
            assert.equal(LiteWeb.fromAscii(input), expected);
        });

        it('should throw an error if the utf-8 string is not a string', function () {
            let result;
            assert.throws(() => {
                LiteWeb.fromAscii([])
            }, 'The passed value is not a valid utf-8 string');
        });

    });

    describe("#toBigNumber", function () {

        it("should convert a hex string to a bignumber", function () {

            let input = '0x73616c61';
            let expected = 1935764577;
            assert.equal(LiteWeb.toBigNumber(input).toNumber(), expected);


        });

        it("should convert a number to a bignumber", function () {

            let input = 1935764577;
            let expected = 1935764577;

            assert.equal(LiteWeb.toBigNumber(input).c[0], expected);
        });

        it("should convert a number string to a bignumber", function () {

            let input = '89384775883766237763193576457709388576373';
            let expected = [8938477588376, 62377631935764, 57709388576373];

            assert.equal(LiteWeb.toBigNumber(input).c[0], expected[0]);
            assert.equal(LiteWeb.toBigNumber(input).c[1], expected[1]);
            assert.equal(LiteWeb.toBigNumber(input).c[2], expected[2]);
        });
    });

    describe("#toDecimal", function () {

        it("should convert a hex string to a number", function () {

            let input = '0x73616c61';
            let expected = 1935764577;
            assert.equal(LiteWeb.toDecimal(input), expected);
        });

        it("should convert a number to a bignumber", function () {

            let input = 1935764577;
            let expected = 1935764577;

            assert.equal(LiteWeb.toDecimal(input), expected);
        });

        it("should convert a number string to a bignumber", function () {

            let input = '89384775883766237763193576457709388576373';
            let expected = 8.938477588376623e+40;

            assert.equal(LiteWeb.toDecimal(input), expected);
        });
    });

    describe("#fromDecimal", function () {

        it("should convert a number to an hex string to a number", function () {

            let input = 1935764577;
            let expected = '0x73616c61';
            assert.equal(LiteWeb.fromDecimal(input), expected);
        });

        it("should convert a negative number to an hex string to a number", function () {

            let input = -1935764577;
            let expected = '-0x73616c61';
            assert.equal(LiteWeb.fromDecimal(input), expected);
        });
    });


    describe("#toSun", function () {

        it("should convert some xlt to sun", function () {

            let input = 324;
            let expected = 324e6;
            assert.equal(LiteWeb.toSun(input), expected);
        });
    });


    describe("#fromSun", function () {
        it("should convert a negative number to an hex string to a number", function () {

            let input = 3245e6;
            let expected = 3245;
            assert.equal(LiteWeb.fromSun(input), expected);
        });
    });

    describe("#isAddress", function () {
        it("should verify that a string is a valid base58 address", function () {

            let input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG';
            assert.equal(LiteWeb.isAddress(input), true);
        });

        it("should verify that a string is an invalid base58 address", function () {

            let input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUs';
            assert.equal(LiteWeb.isAddress(input), false);

            input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG89';
            assert.equal(LiteWeb.isAddress(input), false);

            input = 'aYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG';
            assert.equal(LiteWeb.isAddress(input), false);
        });

        it("should verify that a string is a valid hex address", function () {

            let input = '4165cfbd57fa4f20687b2c33f84c4f9017e5895d49';
            assert.equal(LiteWeb.isAddress(input), true);
        });

        it("should verify that a string is an invalid base58 address", function () {

            let input = '0x65cfbd57fa4f20687b2c33f84c4f9017e5895d49';
            assert.equal(LiteWeb.isAddress(input), false);

            input = '4165cfbd57fa4f20687b2c33f84c4f9017e589';
            assert.equal(LiteWeb.isAddress(input), false);

            input = '4165cfbd57fa4f20687b2c33f84c4f9017e5895d4998';
            assert.equal(LiteWeb.isAddress(input), false);
        });
    });

    describe("#createAccount", function () {
        it("should create a new account", async function () {
            const liteWeb = liteWebBuilder.createInstance();

            const newAccount = await LiteWeb.createAccount();
            assert.equal(newAccount.privateKey.length, 64);
            assert.equal(newAccount.publicKey.length, 130);
            let address = liteWeb.address.fromPrivateKey(newAccount.privateKey);
            assert.equal(address, newAccount.address.base58);

            // TODO The new accounts returns an uppercase address, while everywhere else we handle lowercase addresses. Maybe we should make it consistent and let createAccount returning a lowercase address
            assert.equal(liteWeb.address.toHex(address), newAccount.address.hex.toLowerCase());
        });
    });

    describe("#isConnected", function () {
        it("should verify that liteWeb is connected to nodes and event server", async function () {

            this.timeout(10000)

            const liteWeb = liteWebBuilder.createInstance();
            const isConnected = await liteWeb.isConnected();

            assert.isTrue(isConnected.fullNode);
            assert.isTrue(isConnected.solidityNode);
            assert.isTrue(isConnected.eventServer);

        });
    });

    describe("#getEventsByTransactionID", async function () {

        let accounts
        let liteWeb
        let contractAddress
        let contract

        before(async function () {
            liteWeb = liteWebBuilder.createInstance();
            accounts = await liteWebBuilder.getTestAccounts(-1);

            const result = await broadcaster(liteWeb.transactionBuilder.createSmartContract({
                abi: [
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "name": "_sender",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "name": "_receiver",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "name": "_amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "SomeEvent",
                        "type": "event"
                    },
                    {
                        "constant": false,
                        "inputs": [
                            {
                                "name": "_receiver",
                                "type": "address"
                            },
                            {
                                "name": "_someAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "emitNow",
                        "outputs": [],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                bytecode: "0x608060405234801561001057600080fd5b50610145806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bed7111f14610046575b600080fd5b34801561005257600080fd5b50610091600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610093565b005b3373ffffffffffffffffffffffffffffffffffffffff167f9f08738e168c835bbaf7483705fb1c0a04a1a3258dd9687f14d430948e04e3298383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a250505600a165627a7a7230582033629e2b0bba53f7b5c49769e7e360f2803ae85ac80e69dd61c7bb48f9f401f30029"
            }, accounts.hex[0]), accounts.pks[0])

            contractAddress = result.receipt.transaction.contract_address
            contract = await liteWeb.contract().at(contractAddress)

        });


        it('should emit an unconfirmed event and get it', async function () {

            this.timeout(60000)
            liteWeb.setPrivateKey(accounts.pks[1])
            let txId = await contract.emitNow(accounts.hex[2], 2000).send({
                from: accounts.hex[1]
            })
            let events
            while (true) {
                events = await liteWeb.getEventByTransactionID(txId)
                if (events.length) {
                    break
                }
                await wait(0.5)
            }

            assert.equal(events[0].result._receiver.substring(2), accounts.hex[2].substring(2))
            assert.equal(events[0].result._sender.substring(2), accounts.hex[1].substring(2))
            assert.equal(events[0].resourceNode, 'fullNode')

        })

    });

    describe("#getEventResult", async function () {

        let accounts
        let liteWeb
        let contractAddress
        let contract
        let eventLength = 0

        before(async function () {
            liteWeb = liteWebBuilder.createInstance();
            accounts = await liteWebBuilder.getTestAccounts(-1);

            const result = await broadcaster(liteWeb.transactionBuilder.createSmartContract({
                abi: [
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "name": "_sender",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "name": "_receiver",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "name": "_amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "SomeEvent",
                        "type": "event"
                    },
                    {
                        "constant": false,
                        "inputs": [
                            {
                                "name": "_receiver",
                                "type": "address"
                            },
                            {
                                "name": "_someAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "emitNow",
                        "outputs": [],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                bytecode: "0x608060405234801561001057600080fd5b50610145806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bed7111f14610046575b600080fd5b34801561005257600080fd5b50610091600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610093565b005b3373ffffffffffffffffffffffffffffffffffffffff167f9f08738e168c835bbaf7483705fb1c0a04a1a3258dd9687f14d430948e04e3298383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a250505600a165627a7a7230582033629e2b0bba53f7b5c49769e7e360f2803ae85ac80e69dd61c7bb48f9f401f30029"
            }, accounts.hex[0]), accounts.pks[0])

            contractAddress = result.receipt.transaction.contract_address
            contract = await liteWeb.contract().at(contractAddress)

        });

        it('should emit an event and wait for it', async function () {

            this.timeout(60000)
            liteWeb.setPrivateKey(accounts.pks[3])
            await contract.emitNow(accounts.hex[4], 4000).send({
                from: accounts.hex[3]
            })
            eventLength++
            let events
            while (true) {
                events = await liteWeb.getEventResult(contractAddress, {
                    eventName: 'SomeEvent',
                    sort: 'block_timestamp'
                })
                if (events.length === eventLength) {
                    break
                }
                await wait(0.5)
            }

            const event = events[events.length - 1]

            assert.equal(event.result._receiver.substring(2), accounts.hex[4].substring(2))
            assert.equal(event.result._sender.substring(2), accounts.hex[3].substring(2))
            assert.equal(event.resourceNode, 'fullNode')

        })


    });

});
