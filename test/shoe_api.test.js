const assert = require('assert');
const ShoeApi = require('../shoe_api');

describe('tests the add shoe function', function() {
    let shoeApi = ShoeApi();
    
    beforeEach(async () => await shoeApi.reset_db());

    it ('Should return (\'no shoe provided\')', async function() {
        assert.equal(await shoeApi.addShoe(), 'no shoe provided');
    })
    
})