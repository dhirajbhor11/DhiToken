let Dhi = artifacts.require("./Dhi.sol");

contract('Dhi', function (accounts) {
    it('check total sypply', function () {
        return Dhi.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function (totalSupply) {
            assert.equal(totalSupply.toNumber(), 3000000, 'total supply ');
        })
    });
})