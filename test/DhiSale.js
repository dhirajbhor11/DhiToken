const DhiSale = artifacts.require("./DhiSale.sol");
const Dhi = artifacts.require("./Dhi.sol");

contract('DhiSale', (accounts) => {
    let DhiInstance;
    let DhiSaleInstance;
    let contractTokens = 10000;
    let buyToken = 10;

    //users account address
    let admin = accounts[0];
    let user1 = accounts[1];
    let user2 = accounts[2];


    it('try to deploy DhiSale', () => {
        return DhiSale.deployed().then((instance) => {
            DhiSaleInstance = instance;
            return DhiSaleInstance.dhiContract();
        }).then((dhiContractAddress) => {
            assert.notEqual(dhiContractAddress, '0x0', 'The address is not same');
        });
    })

    it('Try to buy a token', () => {
        return Dhi.deployed().then((instance) => {
            DhiInstance = instance;
            return DhiSale.deployed();
        }).then((instance1) => {
            DhiSaleInstance = instance1;
            return DhiInstance.transfer(DhiSaleInstance.address, contractTokens, { from: admin });
        }).then((result) => {
            assert.equal(result.logs.length, 1, 'Transfer event not triggered');
            assert.equal(result.logs[0].event, 'Transfer', 'Transfer event called');
            assert.equal(result.logs[0].args._from, admin, 'The admin or sender is mismatched');
            assert.equal(result.logs[0].args._to, DhiSaleInstance.address, 'The reciver is wrong');
            assert.equal(result.logs[0].args._value, contractTokens, 'The value is wrong');
            return DhiSaleInstance.buyToken(buyToken, { from: user1, value: 1 });
        })
    })
})