const assert = require('chai').assert;
const liteWebBuilder = require('./liteWebBuilder');

module.exports = async function (result, string) {

    assert.equal(
        result,
        liteWebBuilder.getInstance().toHex(string).substring(2)
    )
}
