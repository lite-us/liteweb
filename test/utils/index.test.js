const chai = require('chai');
const liteWebBuilder = require('../helpers/liteWebBuilder');
const LiteWeb = liteWebBuilder.LiteWeb;
const BigNumber = require('bignumber.js');

const assert = chai.assert;

describe('LiteWeb.utils', function () {

    describe("#isValidURL()", function () {

        it('should verify good urls', function () {

            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.isValidURL('https://some.example.com:9090/casa?qe=3'))
            assert.isTrue(liteWeb.utils.isValidURL('www.example.com/welcome'))

            assert.isFalse(liteWeb.utils.isValidURL('http:/some.example.com'))

            assert.isFalse(liteWeb.utils.isValidURL(['http://example.com']))

        })

    });

    describe("#isArray()", function () {

        it('should verify that a value is an array', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.isArray([]));
            assert.isTrue(liteWeb.utils.isArray([[2], {a: 3}]));

            assert.isFalse(liteWeb.utils.isArray({}));
            assert.isFalse(liteWeb.utils.isArray("Array"));

        })

    });


    describe("#isJson()", function () {

        it('should verify that a value is a JSON string', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.isJson('[]'));
            assert.isTrue(liteWeb.utils.isJson('{"key":"value"}'));
            assert.isTrue(liteWeb.utils.isJson('"json"'));

            assert.isFalse(liteWeb.utils.isJson({}));
            assert.isFalse(liteWeb.utils.isJson("json"));

        })

    });

    describe("#isBoolean()", function () {

        it('should verify that a value is a JSON string', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.isBoolean(true));
            assert.isTrue(liteWeb.utils.isBoolean('a' == []));

            assert.isFalse(liteWeb.utils.isBoolean({}));
            assert.isFalse(liteWeb.utils.isBoolean("json"));

        })

    });

    describe("#isBigNumber()", function () {

        it('should verify that a value is a JSON string', function () {
            const liteWeb = liteWebBuilder.createInstance();

            const bigNumber = BigNumber('1234565432123456778765434456777')

            assert.isTrue(liteWeb.utils.isBigNumber(bigNumber));

            assert.isFalse(liteWeb.utils.isBigNumber('0x09e80f665949b63b39f3850127eb29b55267306b69e2104c41c882e076524a1c'));
            assert.isFalse(liteWeb.utils.isBigNumber({}));
            assert.isFalse(liteWeb.utils.isBigNumber("json"));

        })

    });


    describe("#isString()", function () {

        it('should verify that a valyue is a string', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.isString('str'));
            assert.isTrue(liteWeb.utils.isString(13..toString()));

            assert.isFalse(liteWeb.utils.isString(2));

        })

    });

    describe("#isFunction()", function () {

        it('should verify that a value is a function', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.isFunction(new Function()));
            assert.isTrue(liteWeb.utils.isFunction(() => {
            }));
            assert.isTrue(liteWeb.utils.isFunction(liteWeb.utils.isFunction));

            assert.isFalse(liteWeb.utils.isFunction({function: new Function}));

        })

    });

    describe('#isHex()', function () {
        it('should verify that a string is an hex string', function () {

            const liteWeb = liteWebBuilder.createInstance();

            let input = '0x1';
            let expected = true;
            assert.equal(liteWeb.utils.isHex(input), expected);

            input = '0x0';
            expected = true;
            assert.equal(liteWeb.utils.isHex(input), expected);

            input = '0x73616c616d6f6e';
            expected = true;
            assert.equal(liteWeb.utils.isHex(input), expected);

            input = '73616c616d6f';
            expected = true;
            assert.equal(liteWeb.utils.isHex(input), expected);

            input = '0x73616c616d6fsz';
            expected = false;
            assert.equal(liteWeb.utils.isHex(input), expected);

            input = 'x898989';
            expected = false;
            assert.equal(liteWeb.utils.isHex(input), expected);

        });

    });

    describe("#isInteger()", function () {

        it('should verify that a value is an integer', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.isInteger(2345434));
            assert.isTrue(liteWeb.utils.isInteger(-234e4));

            assert.isFalse(liteWeb.utils.isInteger(3.4));
            assert.isFalse(liteWeb.utils.isInteger('integer'));

        })

    });

    describe("#hasProperty()", function () {

        it('should verify that an object has a specific property', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.hasProperty({p: 2}, 'p'));
            assert.isFalse(liteWeb.utils.hasProperty([{p: 2}], 'p'));

            assert.isFalse(liteWeb.utils.hasProperty({a: 2}, 'p'));

        })

    });

    describe("#hasProperties()", function () {

        it('should verify that an object has some specific properties', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.isTrue(liteWeb.utils.hasProperties({p: 2, s: 2}, 'p', 's'));

            assert.isFalse(liteWeb.utils.hasProperties({p: 2, s: 2}, 'p', 'q'));

        })

    });


    describe("#mapEvent()", function () {

        it('should map an event result', function () {
            const liteWeb = liteWebBuilder.createInstance();

            const event = {
                block_number: 'blockNumber',
                block_timestamp: 'blockTimestamp',
                contract_address: 'contractAddress',
                event_name: 'eventName',
                transaction_id: 'transactionId',
                result: 'result',
                resource_Node: 'resourceNode'
            }

            const expected = {
                block: 'blockNumber',
                timestamp: 'blockTimestamp',
                contract: 'contractAddress',
                name: 'eventName',
                transaction: 'transactionId',
                result: 'result',
                resourceNode: 'resourceNode'
            }

            const mapped = liteWeb.utils.mapEvent(event)
            for(let key in mapped) {
                assert.equal(mapped[key], expected[key])
            }

        })

    });

    describe('#parseEvent', function () {
        // TODO
    });

    describe("#padLeft()", function () {

        it('should return the pad left of a string', function () {
            const liteWeb = liteWebBuilder.createInstance();

            assert.equal(liteWeb.utils.padLeft('09e80f', '0', 12), '00000009e80f');
            // assert.equal(liteWeb.utils.padLeft(new Function, '0', 32), '0000000function anonymous() {\n\n}');
            assert.equal(liteWeb.utils.padLeft(3.4e3, '0', 12), '000000003400');

        })

    });

    describe("#ethersUtils()", function () {

        it('should import sha256 from ethers and has a string', function () {
            const liteWeb = liteWebBuilder.createInstance();

            const string = '0x' + Buffer.from('some string').toString('hex');
            const hash = liteWeb.utils.ethersUtils.sha256(string);

            assert.equal(hash, '0x61d034473102d7dac305902770471fd50f4c5b26f6831a56dd90b5184b3c30fc');

        })

    });

});
