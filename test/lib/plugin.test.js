const chai = require('chai');
const {FULL_NODE_API} = require('../helpers/config');
const assertThrow = require('../helpers/assertThrow');
const liteWebBuilder = require('../helpers/liteWebBuilder');
const LiteWeb = liteWebBuilder.LiteWeb;
const GetNowBlock = require('../helpers/getnowblock');
const jlog = require('../helpers/jlog')

const assert = chai.assert;

describe('LiteWeb.lib.plugin', async function () {

    let liteWeb;

    before(async function () {
        liteWeb = liteWebBuilder.createInstance();
    });

    describe('#constructor()', function () {

        it('should have been set a full instance in liteWeb', function () {

            assert.instanceOf(liteWeb.plugin, LiteWeb.Plugin);
        });

    });

    describe("#plug GetNowBlock", async function () {

        it('should register the plugin GetNowBlock', async function () {

            const someParameter = 'someValue'

            let result = liteWeb.plugin.register(GetNowBlock, {
                someParameter
            })
            assert.isTrue(result.skipped.includes('_parseToken'))
            assert.isTrue(result.plugged.includes('getCurrentBlock'))
            assert.isTrue(result.plugged.includes('getLatestBlock'))

            result = await liteWeb.xlt.getCurrentBlock()
            assert.isTrue(result.fromPlugin)

            result = await liteWeb.xlt.getSomeParameter()
            assert.equal(result, someParameter)

        })

    });


});
